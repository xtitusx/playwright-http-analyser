import { Tyr } from '@xtitusx/type-guard';

import { HttpCycle } from './http-cycle';
import { HttpRequest } from './http-request';
import { HttpResponse } from './http-response';

export class HttpAnalyserSummary {
    private httpMessageCount: number;
    private httpRequestCount: number;
    private httpResponseCount: number;
    private httpInformationalResponseCount: number;
    private httpSuccessfulResponseCount: number;
    private httpRedirectionResponseCount: number;
    private httpClientErrorResponseCount: number;
    private httpServerErrorResponseCount: number;

    constructor() {
        this.init();
    }

    private init(): void {
        this.httpMessageCount = 0;
        this.httpRequestCount = 0;
        this.httpResponseCount = 0;
        this.httpInformationalResponseCount = 0;
        this.httpSuccessfulResponseCount = 0;
        this.httpRedirectionResponseCount = 0;
        this.httpClientErrorResponseCount = 0;
        this.httpServerErrorResponseCount = 0;
    }

    /**
     *
     * @returns The number of already aggregated HTTP messages.
     */
    public getHttpMessageCount(): number {
        return this.httpMessageCount;
    }

    /**
     * Aggregates report.
     * @param httpMessageCount
     * @param httpCycles
     * @returns
     */
    public aggregate(httpMessageCount: number, httpCyclesByUrl: Map<string, HttpCycle>): this {
        const httpCycles = Array.from(httpCyclesByUrl);
        this.httpMessageCount = httpMessageCount;
        this.aggregateHttpRequestCount(httpCycles);
        this.aggregateHttpResponseCount(httpCycles);
        this.aggregateInformationalResponseCount(httpCycles);
        this.aggregateSuccessfulResponseCount(httpCycles);
        this.aggregateRedirectionResponseCount(httpCycles);
        this.aggregateClientErrorResponseCount(httpCycles);
        this.aggregateServerErrorResponseCount(httpCycles);

        return this;
    }

    private aggregateHttpRequestCount(httpCycles: Array<[string, HttpCycle]>): void {
        this.httpRequestCount = httpCycles.filter(([, httpCycle]) =>
            Tyr.class().isInstanceOf(HttpRequest).guard(httpCycle.getHttpRequest()).isSuccess()
        ).length;
    }

    private aggregateHttpResponseCount(httpCycles: Array<[string, HttpCycle]>): void {
        this.httpResponseCount = httpCycles.filter(([, httpCycle]) =>
            Tyr.class().isInstanceOf(HttpResponse).guard(httpCycle.getHttpResponse()).isSuccess()
        ).length;
    }

    private aggregateInformationalResponseCount(httpCycles: Array<[string, HttpCycle]>): void {
        this.httpInformationalResponseCount = httpCycles.filter(([, httpCycle]) =>
            httpCycle?.getHttpResponse().isInformational()
        ).length;
    }

    private aggregateSuccessfulResponseCount(httpCycles: Array<[string, HttpCycle]>): void {
        this.httpSuccessfulResponseCount = httpCycles.filter(([, httpCycle]) =>
            httpCycle?.getHttpResponse().isSuccessful()
        ).length;
    }

    private aggregateRedirectionResponseCount(httpCycles: Array<[string, HttpCycle]>): void {
        this.httpRedirectionResponseCount = httpCycles.filter(
            ([, httpCycle]) => httpCycle?.getHttpResponse().isRedirection() === true
        ).length;
    }

    private aggregateClientErrorResponseCount(httpCycles: Array<[string, HttpCycle]>): void {
        this.httpClientErrorResponseCount = httpCycles.filter(([, httpCycle]) =>
            httpCycle?.getHttpResponse().isClientError()
        ).length;
    }

    private aggregateServerErrorResponseCount(httpCycles: Array<[string, HttpCycle]>): void {
        this.httpServerErrorResponseCount = httpCycles.filter(([, httpCycle]) =>
            httpCycle?.getHttpResponse().isServerError()
        ).length;
    }
}
