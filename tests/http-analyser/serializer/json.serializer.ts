import fs from 'fs';
import fsPromises from 'fs/promises';
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
    public async clean(): Promise<void> {
        const files = await fsPromises.readdir(HTTP_ANALYSER_CONFIG.serializer.json.relativePath);

        await Promise.all(
            files.map((file) => {
                fsPromises.unlink(path.resolve(HTTP_ANALYSER_CONFIG.serializer.json.relativePath, file));
                console.log(
                    `${HTTP_ANALYSER_CONFIG.serializer.json.relativePath}/${file} has been removed successfully`
                );
            })
        );
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
