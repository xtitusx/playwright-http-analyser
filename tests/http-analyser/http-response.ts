import { Tyr } from '@xtitusx/type-guard';

import { HttpStatusCode } from './http-status-code';

export class HttpResponse {
    private statusCode: HttpStatusCode;

    constructor(statusCode: HttpStatusCode) {
        this.statusCode = statusCode;
    }

    public getStatusCode(): HttpStatusCode {
        return this.statusCode;
    }

    public isSuccess(): boolean {
        return Tyr.number().isMax(299).guard(this.statusCode).isSuccess();
    }
}
