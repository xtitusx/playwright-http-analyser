import { HttpCycle } from './http-cycle';

export class HttpAnalyserSummary {
    private aggregatedHttpMessageCount: number;
    private httpRequestCount: number;
    private httpResponseCount: number;
    private httpSuccessResponseCount: number;
    private httpErrorResponseCount: number;

    constructor() {
        this.init();
    }

    private init(): void {
        this.aggregatedHttpMessageCount = 0;
        this.httpRequestCount = 0;
        this.httpResponseCount = 0;
        this.httpSuccessResponseCount = 0;
        this.httpErrorResponseCount = 0;
    }

    public getAggregatedHttpMessageCount(): number {
        return this.aggregatedHttpMessageCount;
    }

    public aggregate(httpMessageCount: number, httpCycles: Map<string, HttpCycle>): this {
        this.aggregatedHttpMessageCount = httpMessageCount;
        // TODO
        return this;
    }
}
