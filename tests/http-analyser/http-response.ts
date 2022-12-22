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

    /**
     * Checks if HTTP response status code is between 100 and 199.
     * @returns
     */
    public isInformational(): boolean {
        return Tyr.number().isBetween(100, 199).guard(this.statusCode).isSuccess();
    }

    /**
     * Checks if HTTP response status code is between 200 and 299.
     * @returns
     */
    public isSuccessful(): boolean {
        return Tyr.number().isBetween(200, 299).guard(this.statusCode).isSuccess();
    }

    /**
     * Checks if HTTP response status code is between 300 and 399.
     * @returns
     */
    public isRedirection(): boolean {
        return Tyr.number().isBetween(300, 399).guard(this.statusCode).isSuccess();
    }

    /**
     * Checks if HTTP response status code is between 400 and 499.
     * @returns
     */
    public isClientError(): boolean {
        return Tyr.number().isBetween(400, 499).guard(this.statusCode).isSuccess();
    }

    /**
     * Checks if HTTP response status code is between 500 and 599.
     * @returns
     */
    public isServerError(): boolean {
        return Tyr.number().isBetween(500, 599).guard(this.statusCode).isSuccess();
    }
}
