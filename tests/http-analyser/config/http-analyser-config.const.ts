import { SerializerType } from '../serializer/serializer-type.enum';

export const HTTP_ANALYSER_CONFIG = {
    serializer: {
        clean: false,
        type: SerializerType.JSON,
        json: {
            relativePath: 'playwright-http-analyser-report',
        },
        mongodb: {
            url: '',
            port: '',
        },
    },
    urls: ['https://www.google.fr'],
};
