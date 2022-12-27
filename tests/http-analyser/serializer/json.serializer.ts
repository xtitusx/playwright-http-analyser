import fs from 'fs';
import * as path from 'path';

import { HttpAnalyser } from '../http-analyser';
import { Serializer } from './serializer';

export class JsonSerializer extends Serializer {
    constructor(httpAnalyser: HttpAnalyser) {
        super(httpAnalyser);
    }

    /**
     * @override
     */
    public serialize(): void {
        const filePath = path.resolve(`${this.buildFileName()}`);

        fs.writeFileSync(filePath, JSON.stringify(this.httpAnalyser, null, 2));
    }

    /**
     * @override
     */
    public clean(): void {
        throw new Error('Method not implemented.');
    }

    private buildFileName(): string {
        return this.sanitize(
            `report-${this.httpAnalyser.getDateTime()}-${this.httpAnalyser.getUrl()}-${
                this.httpAnalyser.getUserAgent().getBrowser().name
            }.json`
        );
    }

    private sanitize(fileName: string): string {
        return fileName
            .replace(this.httpAnalyser.getDateTime(), this.httpAnalyser.getDateTime().replace(/-/g, ''))
            .replace(/[^a-zA-Z0-9-.]/g, '_');
    }
}
