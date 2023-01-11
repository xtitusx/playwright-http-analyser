import { LogLevel } from '../dictionaries/log-level.enum';
import { Viewport } from '../dictionaries/viewport.enum';
import { SerializerType } from '../serializer/serializer-type.enum';

export const HTTP_ANALYSER_CONFIG = {
    skipOnFailure: true,
    viewport: Viewport.VP_DEFAULT,
    cache: {
        enabled: true,
    },
    logger: {
        logLevel: LogLevel.INFO,
        silent: false,
        colorize: {
            level: true,
            message: false,
        },
    },
    serializer: {
        clean: true,
        type: SerializerType.JSON,
        json: {
            relativePath: 'playwright-http-analyser-report',
            pretty: true,
        },
        mongodb: {
            url: '',
            port: '',
        },
    },
    aggregation: {
        enabled: true,
    },
    urls: ['https://www.google.fr', 'https://www.hardware.fr', 'https://clubic.com'],
};
