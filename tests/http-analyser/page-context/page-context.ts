import { Page } from '@playwright/test';

export class PageContext {
    private cacheEnabled: boolean;
    protected page: Page;

    constructor(page: Page) {
        this.page = page;
        this.init();
    }

    private init(): void {
        this.cacheEnabled = true;
    }

    public hasCacheEnabled(): boolean {
        return this.cacheEnabled;
    }

    public async setCacheEnabled(cacheEnabled: boolean): Promise<void> {
        if (cacheEnabled === false && this.cacheEnabled === true) {
            await this.disableCache();
            this.cacheEnabled = false;
        } else if (cacheEnabled === true && this.cacheEnabled === false) {
            await this.enableCache();
            this.cacheEnabled = true;
        }
    }

    /**
     * Disables cache in browser.
     * @see https://stackoverflow.com/questions/68522170/playwright-disable-caching-of-webpage-so-i-can-fetch-new-elements-after-scrollin
     */
    protected async disableCache(): Promise<void> {
        this.page.route('**', (route) => route.continue());
    }

    /**
     * Enables cache in browser.
     */
    protected async enableCache(): Promise<void> {
        this.page.unroute('**', (route) => route.continue());
    }
}
