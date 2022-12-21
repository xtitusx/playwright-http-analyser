import { Tyr } from '@xtitusx/type-guard';

export class UrlAnalyser {
    private url: string;
    private httpRequestCount: number;
    private httpSuccessResponseCount: number;
    private httpErrorResponseCount: number;

    constructor(url: string) {
        this.url = url;
        this.init();
    }

    private init(): void {
        this.httpRequestCount = 0;
        this.httpSuccessResponseCount = 0;
        this.httpErrorResponseCount = 0;
    }

    public getUrl(): string {
        return this.url;
    }

    public getHttpRequestCount(): number {
        return this.httpRequestCount;
    }

    public incrementHttpRequestCount() {
        this.httpRequestCount++;
    }

    public getHttpSuccessResponseCount(): number {
        return this.httpSuccessResponseCount;
    }

    public getHttpErrorResponseCount(): number {
        return this.httpErrorResponseCount;
    }

    public incrementHttpResponseCount(httpStatusCode: number) {
        if (Tyr.number().isMax(399).guard(httpStatusCode).isSuccess()) {
            this.httpSuccessResponseCount++;
        } else {
            this.httpErrorResponseCount++;
        }
    }
}
