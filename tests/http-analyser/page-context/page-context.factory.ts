import { Page } from '@playwright/test';
import { Tyr } from '@xtitusx/type-guard';

import { PageContext } from './page-context';
import { BrowserType } from './browser-type.enum';
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
     * @param browserType
     * @throws {RangeError} If browserType value is not correctly set.
     */
    public create(browserType: BrowserType, page: Page): PageContext {
        let pageContext: PageContext;

        const guardResult = Tyr.string().isIn(Object.values(BrowserType)).guard(browserType);

        if (!guardResult.isSuccess()) {
            throw new RangeError(guardResult.getMessage());
        }

        switch (browserType) {
            case BrowserType.CHROME: {
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
