import { Tyr } from '@xtitusx/type-guard';

import { HttpCycle } from './http-cycle';

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
