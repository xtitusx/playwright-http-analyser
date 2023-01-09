import { Page, TestInfo } from '@playwright/test';
import uaParser from 'ua-parser-js';

import { HTTP_ANALYSER_CONFIG } from './config/http-analyser-config.const';
import { HttpAnalyser } from './http-analyser';
import { PageContextFactory } from './page-context/page-context.factory';
import { BrowserType } from './dictionaries/browser-type.enum';
import { HttpAnalyserConfig } from './http-analyser-config';

export class HttpAnalyserFacade {
    private page: Page;
    private testInfo: TestInfo;

    constructor(page: Page, testInfo: TestInfo) {
        this.page = page;
        this.testInfo = testInfo;
    }

    /**
     * Builds a HttpAnalyser instance under the hood.
     */
    public async build(): Promise<HttpAnalyser> {
        const { os, browser, ua } = uaParser(await this.page.evaluate(() => navigator.userAgent));

        const pageContext = PageContextFactory.getInstance().create(browser.name as BrowserType, this.page);

        await pageContext.setCacheEnabled(HTTP_ANALYSER_CONFIG.cache.enabled);

        return new HttpAnalyser(
            this.testInfo.title.substring(this.testInfo.title.indexOf(': ') + 2),
            new HttpAnalyserConfig(os, browser, ua, this.testInfo.workerIndex, pageContext.hasCacheEnabled())
        );
    }
}
