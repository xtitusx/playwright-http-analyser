import { IOS, IBrowser } from 'ua-parser-js';

export class HttpAnalyserUserAgent {
    private os: IOS;
    private browser: IBrowser;
    private ua: string;

    constructor(os: IOS, browser: IBrowser, ua: string) {
        this.os = os;
        this.browser = browser;
        this.ua = ua;
    }

    public getOs(): IOS {
        return this.os;
    }

    public getBrowser(): IBrowser {
        return this.browser;
    }

    public getUa(): string {
        return this.ua;
    }
}
