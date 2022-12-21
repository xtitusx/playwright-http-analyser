import { GuardResultBulk, Tyr } from '@xtitusx/type-guard';

import { HttpRequest } from './http-request';
import { HttpResponse } from './http-response';

export interface IHttpCycleOptions {
    httpRequest?: HttpRequest;
    httpResponse?: HttpResponse;
}

export class HttpCycle {
    private httpRequest: HttpRequest;
    private httpResponse: HttpResponse;

    constructor(options: IHttpCycleOptions) {
        if (options.httpRequest) {
            this.httpRequest = options.httpRequest;
        }

        if (options.httpResponse) {
            this.httpResponse = options.httpResponse;
        }
    }

    public getHttpRequest(): HttpRequest {
        return this.httpRequest;
    }

    public setHttpRequest(httpRequest: HttpRequest): void {
        this.httpRequest = httpRequest;
    }

    public getHttpResponse(): HttpResponse {
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
