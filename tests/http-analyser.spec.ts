import util from 'util';
import { expect, test } from '@playwright/test';

import { HTTP_ANALYSER_CONFIG } from './http-analyser-config.const';
import { HttpAnalyser } from './http-analyser/http-analyser';
import { HttpAnalyserFacade } from './http-analyser/http-analyser.facade';
import { SerializerFactory } from './http-analyser/serializer/serializer.factory';
import { Serializer } from './http-analyser/serializer/serializer';
import { WinstonLogger } from './http-analyser/logger/winston.logger';
import { LogLevel } from './http-analyser/dictionaries/log-level.enum';
import { ConfigUtils } from './http-analyser/utils/config.utils';
import { IScrollingOptions } from './http-analyser/http-analyser-config';

const logger = WinstonLogger.getInstance();
let serializer: Serializer;
let httpAnalyser: HttpAnalyser;

test.describe.configure({ mode: 'serial' });
test.use({
    viewport: ConfigUtils.initViewPort(),
});

test.beforeAll(async ({}, testInfo) => {
    const guardResult = ConfigUtils.guardUrls();
    expect(guardResult.isSuccess(), guardResult.getMessage()).toBe(true);

    serializer = SerializerFactory.getInstance().create(HTTP_ANALYSER_CONFIG.serializer.type);

    if (HTTP_ANALYSER_CONFIG.serializer.clean === true && testInfo.workerIndex === 0) {
        await serializer.clean();
    }
});

test.beforeEach(async ({ page }, testInfo) => {
    logger.log(LogLevel.INFO, `Running ${testInfo.title}`);

    httpAnalyser = await new HttpAnalyserFacade(page, testInfo).createHttpAnalyser();

    logger.log(
        LogLevel.INFO,
        util.inspect(httpAnalyser.getConfig(), {
            showHidden: false,
            depth: null,
            colors: true,
        })
    );
});

test.afterEach(async ({ page }) => {
    if (HTTP_ANALYSER_CONFIG.aggregation.enabled === true) {
        httpAnalyser.refreshAndGetAggregation();
    } else {
        Object.defineProperty(httpAnalyser, 'aggregation', {
            enumerable: false,
        });
    }

    logger.log(LogLevel.DEBUG, util.inspect(httpAnalyser, { showHidden: false, depth: null, colors: true }));

    const attachmentPath = serializer.serialize(httpAnalyser);

    test.info().attach('report', { contentType: 'application/json', path: attachmentPath });

    await page.close();
});

for (const url of Object.keys(HTTP_ANALYSER_CONFIG.urls.registry)) {
    test(`test with URL: ${url}`, async ({ page }) => {
        /**
         * @see https://playwright.dev/docs/api/class-request
         * @see https://www.checklyhq.com/learn/headless/request-interception/
         * @remarks page.on('request') is not capturing favicon.ico URI: https://github.com/microsoft/playwright/issues/7493
         */
        page.on('request', async (request) => {
            logger.log(LogLevel.INFO, ['>>', request.method(), request.url()].join(' '));
            await httpAnalyser.parseHttpMessage(request);
        });

        page.on('response', (response) => {
            logger.log(LogLevel.INFO, ['<<', response.status(), response.url()].join(' '));
            httpAnalyser.parseHttpMessage(response);
        });

        try {
            await page.goto(url, { waitUntil: 'networkidle' });

            if (httpAnalyser.getConfig().getScrollingOptions().enabled === true) {
                await page.evaluate(async function (scrollingOptions: IScrollingOptions) {
                    const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

                    let repeat = 0;

                    for (let y = 0; y < document.body.scrollHeight; y += scrollingOptions.pixels) {
                        if (repeat < scrollingOptions.repeat || scrollingOptions.repeat < 0) {
                            window.scrollTo(0, y);
                            await delay(scrollingOptions.waitTime);
                            repeat++;
                        } else if (repeat === scrollingOptions.repeat) {
                            break;
                        }
                    }
                }, httpAnalyser.getConfig().getScrollingOptions());
            }

            // Resource Timing API
            httpAnalyser.setNavigationTimings(await page.evaluate(() => performance.getEntriesByType('navigation')));

            // Resource Timing API
            httpAnalyser.setResourceTimings(await page.evaluate(() => window.performance.getEntriesByType('resource')));
        } catch (err) {
            /**
             * @example Test timeout exceeded
             */
            logger.log(LogLevel.ERROR, err.message);
            httpAnalyser.setTestError({ message: err.message, stack: err.stack });
            test.skip(HTTP_ANALYSER_CONFIG.skipOnFailure === true, err.message);

            throw err;
        }
    });
}
