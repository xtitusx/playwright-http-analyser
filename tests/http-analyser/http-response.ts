import { Response } from '@playwright/test';
import { Tyr } from '@xtitusx/type-guard';

import { HttpStatusCode } from './http-status-code';

export class HttpResponse {
    private statusCode: HttpStatusCode;

    constructor(response: Response) {
        this.statusCode = response.status();
    }

    public getStatusCode(): HttpStatusCode {
        return this.statusCode;
    }

    public isSuccess(): boolean {
        return Tyr.number().isMax(299).guard(this.statusCode).isSuccess();
    }
}
