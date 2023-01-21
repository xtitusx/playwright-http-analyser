import { IOS, IBrowser } from 'ua-parser-js';

export interface IScrollingOptions {
    enabled: boolean;
    pixels: number;
    waitTime: number;
    repeat: number;
}
export interface IViewport {
    width: number;
    height: number;
}

export class HttpAnalyserConfig {
    private scrollingOptions: IScrollingOptions;
    private os: IOS;
    private browser: IBrowser;
    private userAgent: string;
    private viewport: IViewport;
    private cacheEnabled: boolean;
    private workerIndex: number;

    constructor(
        scrollingOptions: IScrollingOptions,
        os: IOS,
        browser: IBrowser,
        userAgent: string,
        viewport: IViewport,
        cacheEnabled: boolean,
        workerIndex: number
    ) {
        this.scrollingOptions = scrollingOptions;
        this.os = os;
        this.browser = browser;
        this.userAgent = userAgent;
        this.viewport = viewport;
        this.cacheEnabled = cacheEnabled;
        this.workerIndex = workerIndex;
    }

    public getScrollingOptions(): IScrollingOptions {
        return this.scrollingOptions;
    }

    public getOs(): IOS {
        return this.os;
    }

    public getBrowser(): IBrowser {
        return this.browser;
    }

    public getUserAgent(): string {
        return this.userAgent;
    }

    public getViewport(): IViewport {
        return this.viewport;
    }

    public hasCacheEnabled(): boolean {
        return this.cacheEnabled;
    }

    public getWorkerIndex(): number {
        return this.workerIndex;
    }
}
