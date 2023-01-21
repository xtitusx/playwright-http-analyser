import { Request, Response, TestError } from '@playwright/test';

import { HttpAnalyserAggregation } from './http-analyser-aggregation';
import { HttpAnalyserConfig } from './http-analyser-config';
import { HttpCycle } from './http-cycle';
import { HttpRequest } from './http-request';
import { HttpResponse } from './http-response';
import { HttpScheme } from './dictionaries/types';

export class HttpAnalyser {
    private dateTime: string;
    private url: string;
    private config: HttpAnalyserConfig;
    private aggregation: HttpAnalyserAggregation;
    private network: Map<string, HttpCycle>;
    /**
     * Transient property.
     */
    private httpMessageCount: number;
    private navigationTimings: PerformanceEntry[];
    private resourceTimings: PerformanceEntry[];
    private testError: TestError;

    constructor(url: string, config: HttpAnalyserConfig) {
        this.url = url;
        this.config = config;
        this.init();
    }

    private init(): void {
        this.dateTime = new Date().toISOString();
        this.aggregation = new HttpAnalyserAggregation();
        this.network = new Map();
        this.httpMessageCount = 0;
        Object.defineProperty(this, 'httpMessageCount', {
            enumerable: false,
        });
    }

    public getDateTime(): string {
        return this.dateTime;
    }

    public getUrl(): string {
        return this.url;
    }

    public getConfig(): HttpAnalyserConfig {
        return this.config;
    }

    /**
     * Forces an aggregation refresh on the getter if needed.
     * @returns
     */
    public refreshAndGetAggregation(): HttpAnalyserAggregation {
        return this.aggregation.getNetworkTotalCount() !== this.httpMessageCount
            ? this.aggregation.aggregate(this.httpMessageCount, this.network)
            : this.aggregation;
    }

    public getNetwork(): Map<string, HttpCycle> {
        return this.network;
    }

    public getNavigationTimings(): PerformanceEntry[] {
        return this.navigationTimings;
    }

    public setNavigationTimings(perfEntries: PerformanceEntry[]): void {
        this.navigationTimings = perfEntries;
    }

    public getResourceTimings(): PerformanceEntry[] {
        return this.resourceTimings;
    }

    public setResourceTimings(perfEntries: PerformanceEntry[]): void {
        this.resourceTimings = perfEntries;
    }

    public getTestError(): TestError {
        return this.testError;
    }

    public setTestError(testError: TestError): void {
        this.testError = testError;
    }

    /**
     * Parses and adds the built HttpRequest or HttpResponse instance in the corresponding HttpCycle instance.
     * @param request
     */
    public async parseHttpMessage(message: Request | Response): Promise<void> {
        switch (message.constructor.name) {
            case 'Request': {
                await this.addHttpRequest(message as Request);
                break;
            }
            case 'Response': {
                this.addHttpResponse(message as Response);
                break;
            }
        }

        this.httpMessageCount++;
    }

    /**
     * Adds the built HttpRequest instance in the corresponding HttpCycle instance.
     * @param request
     */
    private async addHttpRequest(request: Request): Promise<void> {
        const httpScheme =
            ((await request.headerValue(':scheme')) as HttpScheme) ?? this.extractHttpScheme(request.url());

        const httpRequest = new HttpRequest(request, httpScheme);

        if (this.getNetwork().has(request.url())) {
            this.getNetwork().get(request.url())?.setHttpRequest(httpRequest);
        } else {
            this.getNetwork().set(request.url(), new HttpCycle({ httpRequest: httpRequest }));
        }
    }

    /**
     * Adds the built HttpResponse instance in the corresponding HttpCycle instance.
     * @param request
     */
    private addHttpResponse(response: Response): void {
        const httpResponse = new HttpResponse(response);

        if (this.getNetwork().has(response.url())) {
            this.getNetwork().get(response.url())?.setHttpResponse(httpResponse);
        } else {
            this.getNetwork().set(response.url(), new HttpCycle({ httpResponse: httpResponse }));
        }
    }

    /**
     * Manually extracts HttpScheme from Url.
     * @param url
     * @returns
     */
    private extractHttpScheme(url: string): HttpScheme {
        return url.substring(0, url.indexOf(':')) as HttpScheme;
    }
}
