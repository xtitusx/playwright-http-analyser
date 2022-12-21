import { GuardResultBulk, Tyr } from '@xtitusx/type-guard';

import { HttpRequest } from './http-request';
import { HttpResponse } from './http-response';

export class HttpCycle {
    private httpRequest: HttpRequest | null;
    private httpResponse: HttpResponse | null;

    constructor(httpRequest: HttpRequest | null, httpResponse: HttpResponse | null) {
        this.httpRequest = httpRequest;
        this.httpResponse = httpResponse;
    }

    public getHttpRequest(): HttpRequest | null {
        return this.httpRequest;
    }

    public setHttpRequest(httpRequest: HttpRequest): void {
        this.httpRequest = httpRequest;
    }

    public getHttpResponse(): HttpResponse | null {
        return this.httpResponse;
    }

    public setHttpResponse(httpResponse: HttpResponse): void {
        this.httpResponse = httpResponse;
    }

    /**
     *  The request is complete when a response from the server is received.
     */
    public isComplete(): boolean {
        return new GuardResultBulk()
            .add([
                Tyr.class().isInstanceOf(HttpRequest).guard(this.httpRequest),
                Tyr.class().isInstanceOf(HttpResponse).guard(this.httpResponse),
            ])
            .combine()
            .isSuccess();
    }
}
