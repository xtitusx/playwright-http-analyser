import { Request, Response } from '@playwright/test';
import { Tyr } from '@xtitusx/type-guard';

import { HttpCycle } from './http-cycle';
import { HttpRequest } from './http-request';
import { HttpResponse } from './http-response';
import { HttpScheme } from './types';

export class HttpAnalyser {
    private url: string;
    private httpCycles: Map<string, HttpCycle> = new Map();
    private httpSuccessResponseCount: number;
    private httpErrorResponseCount: number;

    constructor(url: string) {
        this.url = url;
        this.init();
    }

    private init(): void {
        this.httpSuccessResponseCount = 0;
        this.httpErrorResponseCount = 0;
    }

    public getUrl(): string {
        return this.url;
    }

    public getHttpCycles(): Map<string, HttpCycle> {
        return this.httpCycles;
    }

    public async addHttpRequest(request: Request): Promise<void> {
        const httpRequest = new HttpRequest(request, (await request.headerValue(':scheme')) as HttpScheme);

        if (this.getHttpCycles().has(request.url())) {
            this.getHttpCycles().get(request.url())?.setHttpRequest(httpRequest);
        } else {
            this.getHttpCycles().set(request.url(), new HttpCycle({ httpRequest: httpRequest }));
        }
    }

    public addHttpResponse(response: Response): void {
        const httpResponse = new HttpResponse(response);

        if (this.getHttpCycles().has(response.url())) {
            this.getHttpCycles().get(response.url())?.setHttpResponse(httpResponse);
        } else {
            this.getHttpCycles().set(response.url(), new HttpCycle({ httpResponse: httpResponse }));
        }
    }

    public getHttpRequestCount(): number {
        return this.httpCycles.size;
    }

    public getHttpResponseCount(): number {
        return this.httpCycles.size;
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
