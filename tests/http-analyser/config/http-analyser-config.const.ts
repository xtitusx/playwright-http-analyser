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
            message: true,
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
    urls: {
        defaultScrollDown: { enabled: false, pixels: 100, delay: 100 },
        registry: [
            {
                url: 'https://www.google.fr',
                scrollDown: {
                    enabled: false,
                },
            },
            {
                url: 'https://www.hardware.fr',
                scrollDown: {
                    enabled: false,
                },
            },
            {
                url: 'https://www.clubic.com',
                scrollDown: {
                    enabled: false,
                    pixels: 100,
                    delay: 50,
                },
            },
        ],
    },
};
