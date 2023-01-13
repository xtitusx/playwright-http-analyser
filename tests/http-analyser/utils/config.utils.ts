import { GuardResult, GuardResultBulk, Tyr } from '@xtitusx/type-guard';

import { HTTP_ANALYSER_CONFIG } from '../config/http-analyser-config.const';
import { IScrolling, IViewport } from '../http-analyser-config';

export class ConfigUtils {
    public static convertViewPort(): IViewport {
        return {
            width: parseInt(HTTP_ANALYSER_CONFIG.viewport.split('x').shift() as string),
            height: parseInt(HTTP_ANALYSER_CONFIG.viewport.split('x').pop() as string),
        };
    }

    /**
     * Checks if URLs are valid.
     */
    public static guardUrls(): GuardResult {
        return new GuardResultBulk()
            .add([
                ...HTTP_ANALYSER_CONFIG.urls.registry.map((entry, index) => {
                    return Tyr.string()
                        .matches(new RegExp('^http[s]?://[^ ]*$'))
                        .guard(entry.url, `URL_ANALYSER_CONFIG.urls[${index}]`);
                }),
            ])
            .combine();
    }

    /**
     * Merges URL scrolling config into default scrolling config.
     * @param url
     * @returns
     */
    public static getUrlScrolling(url: string): IScrolling {
        return {
            ...HTTP_ANALYSER_CONFIG.urls.default.scrolling,
            ...HTTP_ANALYSER_CONFIG.urls.registry.find((entry) => entry.url === url)?.scrolling,
        };
    }
}
