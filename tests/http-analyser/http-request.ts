import { Request } from '@playwright/test';

import { HttpMethod, HttpScheme } from './types';

export class HttpRequest {
    private url: string;
    private method: HttpMethod;
    private scheme: HttpScheme;

    constructor(request: Request, scheme: HttpScheme) {
        this.url = request.url();
        this.method = request.method() as HttpMethod;
        this.scheme = scheme;
    }

    public getUrl(): string {
        return this.url;
    }

    public getMethod(): HttpMethod {
        return this.method;
    }

    public getScheme(): HttpScheme {
        return this.scheme;
    }
}
