import fs from 'fs';
import * as path from 'path';

import { HTTP_ANALYSER_CONFIG } from '../config/http-analyser-config.const';
import { HttpAnalyser } from '../http-analyser';
import { Serializer } from './serializer';

export class JsonSerializer extends Serializer {
    constructor() {
        super();
    }

    /**
     * @override
     * @param httpAnalyser
     */
    public serialize(httpAnalyser: HttpAnalyser): void {
        this.httpAnalyser = httpAnalyser;
        const filePath = path.resolve(`./${HTTP_ANALYSER_CONFIG.serializer.json.relativePath}/${this.buildFileName()}`);
        fs.writeFileSync(filePath, JSON.stringify(this.httpAnalyser, null, 2));
    }

    /**
     * @override
     */
    public clean(): void {
        throw new Error('Method not implemented.');
    }

    private buildFileName(): string {
        return this.sanitizeFileName(
            `report-${this.httpAnalyser.getDateTime()}-${this.httpAnalyser.getUrl()}-${
                this.httpAnalyser.getUserAgent().getBrowser().name
            }.json`
        );
    }

    private sanitizeFileName(fileName: string): string {
        return fileName
            .replace(this.httpAnalyser.getDateTime(), this.httpAnalyser.getDateTime().replace(/-/g, ''))
            .replace(/[^a-zA-Z0-9-.]/g, '_');
    }
}
