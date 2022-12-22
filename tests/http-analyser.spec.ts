import { expect, test } from '@playwright/test';
import { GuardResultBulk, Tyr } from '@xtitusx/type-guard';

import { HTTP_ANALYSER_CONFIG } from './http-analyser-config.const';
import { HttpAnalyser } from './http-analyser/http-analyser';

let httpAnalyser: HttpAnalyser;

test.describe.configure({ mode: 'serial' });

test.beforeAll(async () => {
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
});

test.beforeEach(async ({}, testInfo) => {
    console.log(`Running ${testInfo.title}`);
    httpAnalyser = new HttpAnalyser(testInfo.title.substring(testInfo.title.indexOf(': ') + 2));
});

test.afterEach(async ({ page }) => {
    const summary = httpAnalyser.getSummary();
    console.log(`HttpRequestCount: ${summary.getHttpRequestCount()}`);
    console.log(`HttpResponseCount: ${summary.getHttpResponseCount()}`);
    console.log(`HttpSuccessResponseCount: ${summary.getHttpSuccessResponseCount()}`);
    console.log(`HttpErrorResponseCount: ${summary.getHttpErrorResponseCount()}`);
    console.log(JSON.parse(JSON.stringify(httpAnalyser)));
    await page.close();
});

for (const url of new Set(HTTP_ANALYSER_CONFIG.urls)) {
    test(`test with URL: ${url}`, async ({ page }) => {
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
