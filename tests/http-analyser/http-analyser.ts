import { Request, Response } from '@playwright/test';
import { IBrowser, IOS } from 'ua-parser-js';

import { HttpAnalyserSummary } from './http-analyser-summary';
import { HttpAnalyserUserAgent } from './http-analyser-user-agent';
import { HttpCycle } from './http-cycle';
import { HttpRequest } from './http-request';
import { HttpResponse } from './http-response';
import { HttpScheme } from './dictionaries/types';

export class HttpAnalyser {
    private dateTime: string;
    private url: string;
    private userAgent: HttpAnalyserUserAgent;
    private summary: HttpAnalyserSummary;
    private httpCyclesByUrl: Map<string, HttpCycle>;
    /**
     * Transient property.
     */
    private httpMessageCount: number;

    constructor(url: string, os: IOS, browser: IBrowser, userAgent: string) {
        this.dateTime = new Date().toISOString();
        this.url = url;
        this.userAgent = new HttpAnalyserUserAgent(os, browser, userAgent);
        this.summary = new HttpAnalyserSummary();
        this.httpCyclesByUrl = new Map();
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

    public getUserAgent(): HttpAnalyserUserAgent {
        return this.userAgent;
    }

    /**
     * Forces a summary refresh on the getter if needed.
     * @returns
     */
    public refreshAndGetSummary(): HttpAnalyserSummary {
        return this.summary.getHttpMessageCount() !== this.httpMessageCount
            ? this.summary.aggregate(this.httpMessageCount, this.httpCyclesByUrl)
            : this.summary;
    }

    public getHttpCyclesByUrl(): Map<string, HttpCycle> {
        return this.httpCyclesByUrl;
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

        if (this.getHttpCyclesByUrl().has(request.url())) {
            this.getHttpCyclesByUrl().get(request.url())?.setHttpRequest(httpRequest);
        } else {
            this.getHttpCyclesByUrl().set(request.url(), new HttpCycle({ httpRequest: httpRequest }));
        }
    }

    /**
     * Adds the built HttpResponse instance in the corresponding HttpCycle instance.
     * @param request
     */
    private addHttpResponse(response: Response): void {
        const httpResponse = new HttpResponse(response);

        if (this.getHttpCyclesByUrl().has(response.url())) {
            this.getHttpCyclesByUrl().get(response.url())?.setHttpResponse(httpResponse);
        } else {
            this.getHttpCyclesByUrl().set(response.url(), new HttpCycle({ httpResponse: httpResponse }));
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
