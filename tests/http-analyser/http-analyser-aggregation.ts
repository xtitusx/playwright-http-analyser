import { Tyr } from '@xtitusx/type-guard';

import { HttpCycle } from './http-cycle';
import { HttpRequest } from './http-request';
import { HttpResponse } from './http-response';

export class HttpAnalyserAggregation {
    private network: {
        count: {
            total: number;
            httpRequest: number;
            httpResponse: {
                total: number;
                informational: number;
                successfull: number;
                redirection: number;
                clientError: number;
                serverError: number;
            };
        };
    };

    constructor() {
        this.init();
    }

    private init(): void {
        this.network = {
            count: {
                total: 0,
                httpRequest: 0,
                httpResponse: {
                    total: 0,
                    informational: 0,
                    successfull: 0,
                    redirection: 0,
                    clientError: 0,
                    serverError: 0,
                },
            },
        };
    }

    /**
     *
     * @returns The number of already aggregated HTTP messages.
     */
    public getNetworkTotalCount(): number {
        return this.network.count.total;
    }

    /**
     * Aggregates report.
     * @param httpMessageCount
     * @param network
     * @returns
     */
    public aggregate(httpMessageCount: number, network: Map<string, HttpCycle>): this {
        const httpCycles = Array.from(network);
        this.network.count.total = httpMessageCount;
        this.aggregateNetworkHttpRequestCount(httpCycles);
        this.aggregateNetworkHttpResponseCount(httpCycles);
        this.aggregateNetworkInformationalHttpResponseCount(httpCycles);
        this.aggregateNetworkSuccessfulHttpResponseCount(httpCycles);
        this.aggregateNetworkRedirectionHttpResponseCount(httpCycles);
        this.aggregateNetworkClientErrorHttpResponseCount(httpCycles);
        this.aggregateNetworkServerErrorHttpResponseCount(httpCycles);

        return this;
    }

    private aggregateNetworkHttpRequestCount(httpCycles: Array<[string, HttpCycle]>): void {
        this.network.count.httpRequest = httpCycles.filter(([, httpCycle]) =>
            Tyr.class().isInstanceOf(HttpRequest).guard(httpCycle.getHttpRequest()).isSuccess()
        ).length;
    }

    private aggregateNetworkHttpResponseCount(httpCycles: Array<[string, HttpCycle]>): void {
        this.network.count.httpResponse.total = httpCycles.filter(([, httpCycle]) =>
            Tyr.class().isInstanceOf(HttpResponse).guard(httpCycle.getHttpResponse()).isSuccess()
        ).length;
    }

    private aggregateNetworkInformationalHttpResponseCount(httpCycles: Array<[string, HttpCycle]>): void {
        this.network.count.httpResponse.informational = httpCycles.filter(([, httpCycle]) =>
            httpCycle?.getHttpResponse()?.isInformational()
        ).length;
    }

    private aggregateNetworkSuccessfulHttpResponseCount(httpCycles: Array<[string, HttpCycle]>): void {
        this.network.count.httpResponse.successfull = httpCycles.filter(([, httpCycle]) =>
            httpCycle?.getHttpResponse()?.isSuccessful()
        ).length;
    }

    private aggregateNetworkRedirectionHttpResponseCount(httpCycles: Array<[string, HttpCycle]>): void {
        this.network.count.httpResponse.redirection = httpCycles.filter(([, httpCycle]) =>
            httpCycle?.getHttpResponse()?.isRedirection()
        ).length;
    }

    private aggregateNetworkClientErrorHttpResponseCount(httpCycles: Array<[string, HttpCycle]>): void {
        this.network.count.httpResponse.clientError = httpCycles.filter(([, httpCycle]) =>
            httpCycle?.getHttpResponse()?.isClientError()
        ).length;
    }

    private aggregateNetworkServerErrorHttpResponseCount(httpCycles: Array<[string, HttpCycle]>): void {
        this.network.count.httpResponse.serverError = httpCycles.filter(([, httpCycle]) =>
            httpCycle?.getHttpResponse()?.isServerError()
        ).length;
    }
}
