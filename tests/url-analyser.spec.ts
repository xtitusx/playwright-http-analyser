import { expect, test } from '@playwright/test';
import { GuardResultBulk, Tyr } from '@xtitusx/type-guard';

import { URL_ANALYSER_CONFIG } from './url-analyser-config.const';
import { UrlAnalyser } from './url-analyser/url-analyser';

let urlAnalyser: UrlAnalyser;

test.describe.configure({ mode: 'serial' });

test.beforeAll(async () => {
    const guardResult = new GuardResultBulk()
        .add([
            ...URL_ANALYSER_CONFIG.requestUrls.map((url, index) => {
                return Tyr.string()
                    .isNotEmpty()
                    .contains('http', 'start')
                    .isTrimmed('both')
                    .guard(url, `config.url[${index}]`);
            }),
        ])
        .combine();

    expect(guardResult.isSuccess(), guardResult.getMessage()).toBe(true);
});

test.beforeEach(async ({}, testInfo) => {
    console.log(`Running ${testInfo.title}`);
    urlAnalyser = new UrlAnalyser(testInfo.title.substring(testInfo.title.indexOf(': ') + 2));
});

test.afterEach(async ({ page }) => {
    console.log(`HttpRequestCount: ${urlAnalyser.getHttpRequestCount()}`);
    console.log(`HttpSuccessResponseCount: ${urlAnalyser.getHttpSuccessResponseCount()}`);
    console.log(`HttpErrorResponseCount: ${urlAnalyser.getHttpErrorResponseCount()}`);
    await page.close();
});

for (const url of new Set(URL_ANALYSER_CONFIG.requestUrls)) {
    test(`test with URL: ${url}`, async ({ page }) => {
        /**
         * page.on('request') is not capturing favicon.ico URI: https://github.com/microsoft/playwright/issues/7493
         */
        page.on('request', (request) => {
            console.log('>>', request.method(), request.url());
            urlAnalyser.incrementHttpRequestCount();
        });
        page.on('response', (response) => {
            urlAnalyser.incrementHttpResponseCount(response.status());
        });

        await page.goto(url, { waitUntil: 'networkidle' });
    });
}
