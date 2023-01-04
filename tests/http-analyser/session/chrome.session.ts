import { CDPSession, Page } from '@playwright/test';

import { Session } from './session';

export class ChromeSession extends Session {
    private cdpSession: CDPSession;

    constructor(page: Page) {
        super(page);
    }

    /**
     * @override
     */
    public async disableCache(): Promise<void> {
        super.disableCache();
        this.cdpSession = await this.page.context().newCDPSession(this.page);
        await this.cdpSession.send('Network.setCacheDisabled', { cacheDisabled: true });
    }
}
