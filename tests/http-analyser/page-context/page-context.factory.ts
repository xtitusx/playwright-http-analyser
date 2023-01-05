import { Page } from '@playwright/test';
import { Tyr } from '@xtitusx/type-guard';

import { Browser } from '../dictionaries/browser.enum';
import { PageContext } from './page-context';
import { ChromePageContext } from './chrome.page-context';

export class PageContextFactory {
    private static INSTANCE: PageContextFactory;

    private constructor() {}

    public static getInstance(): PageContextFactory {
        if (!PageContextFactory.INSTANCE) {
            PageContextFactory.INSTANCE = new PageContextFactory();
        }

        return PageContextFactory.INSTANCE;
    }

    /**
     * @param browser
     * @throws {RangeError} If browser value is not correctly set.
     */
    public create(browser: Browser, page: Page): PageContext {
        let pageContext: PageContext;

        const guardResult = Tyr.string().isIn(Object.values(Browser)).guard(browser);

        if (!guardResult.isSuccess()) {
            throw new RangeError(guardResult.getMessage());
        }

        switch (browser) {
            case Browser.CHROME: {
                pageContext = new ChromePageContext(page);
                break;
            }
            default: {
                pageContext = new PageContext(page);
                break;
            }
        }

        return pageContext;
    }
}
