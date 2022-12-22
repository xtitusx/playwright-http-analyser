export class HttpAnalyserSummary {
    private httpRequestCount: number;
    private httpResponseCount: number;
    private httpSuccessResponseCount: number;
    private httpErrorResponseCount: number;

    constructor() {
        this.init();
    }

    private init(): void {
        this.httpRequestCount = 0;
        this.httpResponseCount = 0;
        this.httpSuccessResponseCount = 0;
        this.httpErrorResponseCount = 0;
    }

    public getHttpRequestCount(): number {
        return this.httpRequestCount;
    }

    public getHttpResponseCount(): number {
        return this.httpResponseCount;
    }

    public getHttpSuccessResponseCount(): number {
        return this.httpSuccessResponseCount;
    }

    public getHttpErrorResponseCount(): number {
        return this.httpErrorResponseCount;
    }
}
