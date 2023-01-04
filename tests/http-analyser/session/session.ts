import { Page } from '@playwright/test';

export class Session {
    protected page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    /**
     * @see https://stackoverflow.com/questions/68522170/playwright-disable-caching-of-webpage-so-i-can-fetch-new-elements-after-scrollin
     */
    public async disableCache(): Promise<void> {
        this.page.route('**', (route) => route.continue());
    }
}
