import { IOS, IBrowser } from 'ua-parser-js';

export class HttpAnalyserUserAgent {
    private os: IOS;
    private browser: IBrowser;
    private userAgent: string;

    constructor(os: IOS, browser: IBrowser, userAgent: string) {
        this.os = os;
        this.browser = browser;
        this.userAgent = userAgent;
    }

    public getOs(): IOS {
        return this.os;
    }

    public getBrowser(): IBrowser {
        return this.browser;
    }

    public getUsertAgent(): string {
        return this.userAgent;
    }
}
