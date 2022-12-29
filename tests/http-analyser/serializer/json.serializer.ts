import { Tyr } from '@xtitusx/type-guard';
import fs from 'fs';
import fsPromises from 'fs/promises';
import * as path from 'path';

import { HTTP_ANALYSER_CONFIG } from '../config/http-analyser-config.const';
import { HttpAnalyser } from '../http-analyser';
import { Serializer } from './serializer';

export class JsonSerializer extends Serializer {
    private static readonly REPORT_FILE_PREFIX = 'report';
    private static readonly REPORT_FILE_EXTENSION = '.json';

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
        fs.writeFileSync(
            filePath,
            JSON.stringify(
                this.httpAnalyser,
                null,
                HTTP_ANALYSER_CONFIG.serializer.json.pretty === true ? 2 : undefined
            )
        );
    }

    /**
     * @override
     */
    public async clean(): Promise<void> {
        const files = (await fsPromises.readdir(HTTP_ANALYSER_CONFIG.serializer.json.relativePath)).filter((file) =>
            Tyr.string()
                .contains(JsonSerializer.REPORT_FILE_PREFIX, 'start')
                .contains(JsonSerializer.REPORT_FILE_EXTENSION, 'end')
                .guard(file)
                .isSuccess()
        );

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
            `${JsonSerializer.REPORT_FILE_PREFIX}-${this.httpAnalyser.getDateTime()}-${this.httpAnalyser.getUrl()}-${
                this.httpAnalyser.getUserAgent().getBrowser().name
            }${JsonSerializer.REPORT_FILE_EXTENSION}`
        );
    }

    private sanitizeFileName(fileName: string): string {
        return fileName
            .replace(this.httpAnalyser.getDateTime(), this.httpAnalyser.getDateTime().replace(/-/g, ''))
            .replace(/[^a-zA-Z0-9-.]/g, '_');
    }
}
