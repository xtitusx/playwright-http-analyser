import { CDPSession, Page } from '@playwright/test';

import { PageContext } from './page-context';

export class ChromePageContext extends PageContext {
    private cdpSession: CDPSession;

    constructor(page: Page) {
        super(page);
    }

    /**
     * @override
     */
    protected async disableCache(): Promise<void> {
        super.disableCache();
        this.cdpSession = this.cdpSession ?? (await this.page.context().newCDPSession(this.page));
        await this.cdpSession.send('Network.setCacheDisabled', { cacheDisabled: true });
    }

    /**
     * @override
     */
    protected async enableCache(): Promise<void> {
        super.enableCache();
        this.cdpSession = this.cdpSession ?? (await this.page.context().newCDPSession(this.page));
        await this.cdpSession.send('Network.setCacheDisabled', { cacheDisabled: false });
    }
}
