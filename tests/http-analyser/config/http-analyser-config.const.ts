import { Viewport } from '../dictionaries/viewport.enum';
import { SerializerType } from '../serializer/serializer-type.enum';

export const HTTP_ANALYSER_CONFIG = {
    viewport: Viewport.VP_DEFAULT,
    cache: {
        enabled: true,
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
    urls: ['https://www.google.fr', 'https://www.hardware.fr', 'https://clubic.com'],
};
