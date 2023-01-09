import { IOS, IBrowser } from 'ua-parser-js';

export class HttpAnalyserConfig {
    private os: IOS;
    private browser: IBrowser;
    private userAgent: string;
    private workerIndex: number;
    private cacheEnabled: boolean;

    constructor(os: IOS, browser: IBrowser, userAgent: string, workerIndex: number, cacheEnabled: boolean) {
        this.os = os;
        this.browser = browser;
        this.userAgent = userAgent;
        this.workerIndex = workerIndex;
        this.cacheEnabled = cacheEnabled;
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

    public getWorkerIndex(): number {
        return this.workerIndex;
    }

    public hasCacheEnabled(): boolean {
        return this.cacheEnabled;
    }
}
