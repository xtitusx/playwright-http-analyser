import { Tyr } from '@xtitusx/type-guard';

import { HttpCycle } from './http-cycle';
import { HttpRequest } from './http-request';
import { HttpResponse } from './http-response';

export class HttpAnalyserSummary {
    private httpMessage: { count: number };
    private httpRequest: {
        count: number;
    };
    private httpResponse: {
        count: number;
        informationalCount: number;
        successfullCount: number;
        redirectionCount: number;
        clientErrorCount: number;
        serverErrorCount: number;
    };

    constructor() {
        this.init();
    }

    private init(): void {
        this.httpMessage = { count: 0 };
        this.httpRequest = { count: 0 };
        this.httpResponse = {
            count: 0,
            informationalCount: 0,
            successfullCount: 0,
            redirectionCount: 0,
            clientErrorCount: 0,
            serverErrorCount: 0,
        };
    }

    /**
     *
     * @returns The number of already aggregated HTTP messages.
     */
    public getHttpMessageCount(): number {
        return this.httpMessage.count;
    }

    /**
     * Aggregates report.
     * @param httpMessageCount
     * @param httpCycles
     * @returns
     */
    public aggregate(httpMessageCount: number, httpCyclesByUrl: Map<string, HttpCycle>): this {
        const httpCycles = Array.from(httpCyclesByUrl);
        this.httpMessage.count = httpMessageCount;
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
        this.httpRequest.count = httpCycles.filter(([, httpCycle]) =>
            Tyr.class().isInstanceOf(HttpRequest).guard(httpCycle.getHttpRequest()).isSuccess()
        ).length;
    }

    private aggregateHttpResponseCount(httpCycles: Array<[string, HttpCycle]>): void {
        this.httpResponse.count = httpCycles.filter(([, httpCycle]) =>
            Tyr.class().isInstanceOf(HttpResponse).guard(httpCycle.getHttpResponse()).isSuccess()
        ).length;
    }

    private aggregateInformationalResponseCount(httpCycles: Array<[string, HttpCycle]>): void {
        this.httpResponse.informationalCount = httpCycles.filter(([, httpCycle]) =>
            httpCycle?.getHttpResponse().isInformational()
        ).length;
    }

    private aggregateSuccessfulResponseCount(httpCycles: Array<[string, HttpCycle]>): void {
        this.httpResponse.successfullCount = httpCycles.filter(([, httpCycle]) =>
            httpCycle?.getHttpResponse().isSuccessful()
        ).length;
    }

    private aggregateRedirectionResponseCount(httpCycles: Array<[string, HttpCycle]>): void {
        this.httpResponse.redirectionCount = httpCycles.filter(([, httpCycle]) =>
            httpCycle?.getHttpResponse().isRedirection()
        ).length;
    }

    private aggregateClientErrorResponseCount(httpCycles: Array<[string, HttpCycle]>): void {
        this.httpResponse.clientErrorCount = httpCycles.filter(([, httpCycle]) =>
            httpCycle?.getHttpResponse().isClientError()
        ).length;
    }

    private aggregateServerErrorResponseCount(httpCycles: Array<[string, HttpCycle]>): void {
        this.httpResponse.serverErrorCount = httpCycles.filter(([, httpCycle]) =>
            httpCycle?.getHttpResponse().isServerError()
        ).length;
    }
}
