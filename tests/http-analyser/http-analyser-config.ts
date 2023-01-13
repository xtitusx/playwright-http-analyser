import { IOS, IBrowser } from 'ua-parser-js';

export interface IScrolling {
    enabled: boolean;
    pixels: number;
    delay: number;
    repeat: number;
}
export interface IViewport {
    width: number;
    height: number;
}

export class HttpAnalyserConfig {
    private scrolling: IScrolling;
    private os: IOS;
    private browser: IBrowser;
    private userAgent: string;
    private viewport: IViewport;
    private cacheEnabled: boolean;
    private workerIndex: number;

    constructor(
        scrolling: IScrolling,
        os: IOS,
        browser: IBrowser,
        userAgent: string,
        viewport: IViewport,
        cacheEnabled: boolean,
        workerIndex: number
    ) {
        this.scrolling = scrolling;
        this.os = os;
        this.browser = browser;
        this.userAgent = userAgent;
        this.viewport = viewport;
        this.cacheEnabled = cacheEnabled;
        this.workerIndex = workerIndex;
    }

    public getScrolling(): IScrolling {
        return this.scrolling;
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
