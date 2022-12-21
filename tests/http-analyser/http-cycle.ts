import { HttpRequest } from './http-request';
import { HttpResponse } from './http-response';

export class HttpCycle {
    private httpRequest: HttpRequest;
    private httpResponse: HttpResponse;

    constructor(httpRequest: HttpRequest) {
        this.httpRequest = httpRequest;
    }

    public getHttpRequest(): HttpRequest {
        return this.httpRequest;
    }

    public getHttpResponse(): HttpResponse {
        return this.httpResponse;
    }

    public setHttpResponse(httpResponse: HttpResponse): void {
        this.httpResponse = httpResponse;
    }
}
