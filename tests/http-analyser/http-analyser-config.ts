import { IOS, IBrowser } from 'ua-parser-js';

export class HttpAnalyserConfig {
    private os: IOS;
    private browser: IBrowser;
    private userAgent: string;
    private cacheEnabled: boolean;

    constructor(os: IOS, browser: IBrowser, userAgent: string, cacheEnabled: boolean) {
        this.os = os;
        this.browser = browser;
        this.userAgent = userAgent;
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

    public hasCacheEnabled(): boolean {
        return this.cacheEnabled;
    }
}
