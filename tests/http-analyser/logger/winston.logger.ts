import * as winston from 'winston';

import { HTTP_ANALYSER_CONFIG } from '../../http-analyser-config.const';
import { LogLevel } from '../dictionaries/log-level.enum';

/**
 * A Winston singleton.
 * @remarks
 * ```ts
 * - Format : timestamp level message
 * - Output : Console
 * ```
 */
export class WinstonLogger {
    private static INSTANCE: WinstonLogger;

    private winston: winston.Logger;

    private constructor() {
        this.winston = winston.createLogger({
            level: HTTP_ANALYSER_CONFIG.logger.logLevel,
            format: winston.format.combine(
                winston.format.colorize({
                    level: HTTP_ANALYSER_CONFIG.logger.colorize.level,
                    message: HTTP_ANALYSER_CONFIG.logger.colorize.message,
                }),
                winston.format.simple(),
                winston.format.timestamp({}),
                winston.format.printf((info) => `${info.timestamp} ${info.level} ${info.message}`)
            ),
            transports: [new winston.transports.Console()],
            silent: HTTP_ANALYSER_CONFIG.logger.silent,
        });
    }

    public static getInstance(): winston.Logger {
        if (!WinstonLogger.INSTANCE) {
            WinstonLogger.INSTANCE = new WinstonLogger();
        }

        return WinstonLogger.INSTANCE.winston;
    }

    /**
     * @param logLevel
     * @param message
     */
    public log(logLevel: LogLevel, message: string): void {
        this.winston.log(logLevel, message);
    }
}
