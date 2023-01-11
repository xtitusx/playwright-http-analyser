import util from 'util';
import { expect, test } from '@playwright/test';
import { GuardResultBulk, Tyr } from '@xtitusx/type-guard';

import { HTTP_ANALYSER_CONFIG } from './http-analyser/config/http-analyser-config.const';
import { HttpAnalyser } from './http-analyser/http-analyser';
import { HttpAnalyserFacade } from './http-analyser/http-analyser.facade';
import { SerializerFactory } from './http-analyser/serializer/serializer.factory';
import { Serializer } from './http-analyser/serializer/serializer';

let serializer: Serializer;
let httpAnalyser: HttpAnalyser;

test.describe.configure({ mode: 'serial' });
test.use({
    viewport: {
        width: parseInt(HTTP_ANALYSER_CONFIG.viewport.split('x').shift() as string),
        height: parseInt(HTTP_ANALYSER_CONFIG.viewport.split('x').pop() as string),
    },
});

test.beforeAll(async ({}, testInfo) => {
    const guardResult = new GuardResultBulk()
        .add([
            ...HTTP_ANALYSER_CONFIG.urls.map((url, index) => {
                return Tyr.string()
                    .matches(new RegExp('^http[s]?://[^ ]*$'))
                    .guard(url, `URL_ANALYSER_CONFIG.urls[${index}]`);
            }),
        ])
        .combine();

    expect(guardResult.isSuccess(), guardResult.getMessage()).toBe(true);

    serializer = SerializerFactory.getInstance().create(HTTP_ANALYSER_CONFIG.serializer.type);

    if (HTTP_ANALYSER_CONFIG.serializer.clean === true && testInfo.workerIndex === 0) {
        await serializer.clean();
    }
});

test.beforeEach(async ({ page }, testInfo) => {
    console.log(`Running ${testInfo.title}`);

    httpAnalyser = await new HttpAnalyserFacade(page, testInfo).createHttpAnalyser();
});

test.afterEach(async ({ page }) => {
    if (HTTP_ANALYSER_CONFIG.aggregation.enabled === true) {
        httpAnalyser.refreshAndGetAggregation();
    } else {
        Object.defineProperty(httpAnalyser, 'aggregation', {
            enumerable: false,
        });
    }

    console.log(util.inspect(httpAnalyser, { showHidden: false, depth: null, colors: true }));

    const attachmentPath = serializer.serialize(httpAnalyser);

    test.info().attach('report', { contentType: 'application/json', path: attachmentPath });

    await page.close();
});

for (const url of new Set(HTTP_ANALYSER_CONFIG.urls)) {
    test(`test with URL: ${url}`, async ({ page }) => {
        /**
         * @see https://playwright.dev/docs/api/class-request
         * @see https://www.checklyhq.com/learn/headless/request-interception/
         * @remarks page.on('request') is not capturing favicon.ico URI: https://github.com/microsoft/playwright/issues/7493
         */
        page.on('request', async (request) => {
            console.log('>>', request.method(), request.url());

            await httpAnalyser.parseHttpMessage(request);
        });

        page.on('response', (response) => {
            console.log('<<', response.status(), response.url());

            httpAnalyser.parseHttpMessage(response);
        });

        await page.goto(url, { waitUntil: 'networkidle' });

        // Resource Timing API
        httpAnalyser.setNavigationTimings(await page.evaluate(() => performance.getEntriesByType('navigation')));

        // Resource Timing API
        httpAnalyser.setResourceTimings(await page.evaluate(() => window.performance.getEntriesByType('resource')));
    });
}
