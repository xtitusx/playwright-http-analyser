import { Request, Response } from '@playwright/test';

import { HttpAnalyserSummary } from './http-analyser-summary';
import { HttpCycle } from './http-cycle';
import { HttpRequest } from './http-request';
import { HttpResponse } from './http-response';
import { HttpScheme } from './types';

export class HttpAnalyser {
    private url: string;
    private httpCycles: Map<string, HttpCycle>;
    private summary: HttpAnalyserSummary;
    private httpMessageCount: number;

    constructor(url: string) {
        this.url = url;
        this.httpCycles = new Map();
        this.summary = new HttpAnalyserSummary();
        this.httpMessageCount = 0;
        // Transient property
        Object.defineProperty(this, 'httpMessageCount', {
            enumerable: false,
        });
    }

    public getUrl(): string {
        return this.url;
    }

    public getHttpCycles(): Map<string, HttpCycle> {
        return this.httpCycles;
    }

    /**
     * Forces a summary refresh on the getter if needed.
     * @returns
     */
    public refreshAndGetSummary(): HttpAnalyserSummary {
        return this.summary.getAggregatedHttpMessageCount() !== this.httpMessageCount
            ? this.summary.aggregate(this.httpMessageCount, this.httpCycles)
            : this.summary;
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
        const httpRequest = new HttpRequest(request, (await request.headerValue(':scheme')) as HttpScheme);

        if (this.getHttpCycles().has(request.url())) {
            this.getHttpCycles().get(request.url())?.setHttpRequest(httpRequest);
        } else {
            this.getHttpCycles().set(request.url(), new HttpCycle({ httpRequest: httpRequest }));
        }
    }

    /**
     * Adds the built HttpResponse instance in the corresponding HttpCycle instance.
     * @param request
     */
    private addHttpResponse(response: Response): void {
        const httpResponse = new HttpResponse(response);

        if (this.getHttpCycles().has(response.url())) {
            this.getHttpCycles().get(response.url())?.setHttpResponse(httpResponse);
        } else {
            this.getHttpCycles().set(response.url(), new HttpCycle({ httpResponse: httpResponse }));
        }
    }
}
