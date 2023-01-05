import util from 'util';
import uaParser from 'ua-parser-js';
import { expect, test } from '@playwright/test';
import { GuardResultBulk, Tyr } from '@xtitusx/type-guard';

import { HTTP_ANALYSER_CONFIG } from './http-analyser/config/http-analyser-config.const';
import { HttpAnalyser } from './http-analyser/http-analyser';
import { SerializerFactory } from './http-analyser/serializer/serializer.factory';
import { Serializer } from './http-analyser/serializer/serializer';
import { PageContext } from './http-analyser/page-context/page-context';
import { PageContextFactory } from './http-analyser/page-context/page-context.factory';
import { Browser } from './http-analyser/dictionaries/browser.enum';

let serializer: Serializer;
let pageContext: PageContext;
let httpAnalyser: HttpAnalyser;

test.describe.configure({ mode: 'serial' });

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

    const { os, browser, ua } = uaParser(await page.evaluate(() => navigator.userAgent));

    pageContext = PageContextFactory.getInstance().create(browser.name as Browser, page);

    if (HTTP_ANALYSER_CONFIG.cache.enabled === false) {
        await pageContext.disableCache();
    }

    httpAnalyser = new HttpAnalyser(testInfo.title.substring(testInfo.title.indexOf(': ') + 2), os, browser, ua);
});

test.afterEach(async ({ page }) => {
    httpAnalyser.refreshAndGetSummary();

    console.log(util.inspect(httpAnalyser, { showHidden: false, depth: null, colors: true }));

    serializer.serialize(httpAnalyser);

    await page.close();
});

for (const url of new Set(HTTP_ANALYSER_CONFIG.urls)) {
    test(`test with URL: ${url}`, async ({ page }) => {
        // https://playwright.dev/docs/api/class-request
        // page.on('request') is not capturing favicon.ico URI: https://github.com/microsoft/playwright/issues/7493
        page.on('request', async (request) => {
            console.log('>>', request.method(), request.url());

            await httpAnalyser.parseHttpMessage(request);
        });

        page.on('response', (response) => {
            console.log('<<', response.status(), response.url());

            httpAnalyser.parseHttpMessage(response);
        });

        await page.goto(url, { waitUntil: 'networkidle' });
    });
}
