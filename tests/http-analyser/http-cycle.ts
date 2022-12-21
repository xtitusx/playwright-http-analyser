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
}
