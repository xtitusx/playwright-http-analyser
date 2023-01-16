import { GuardResult, GuardResultBulk, Tyr } from '@xtitusx/type-guard';

import { HTTP_ANALYSER_CONFIG } from '../../http-analyser-config.const';
import { IScrollingOptions as IScrollingOptions, IViewport } from '../http-analyser-config';

export class ConfigUtils {
    public static initViewPort(): IViewport {
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
                ...Object.keys(HTTP_ANALYSER_CONFIG.urls.registry).map((url) => {
                    return Tyr.string()
                        .matches(new RegExp('^http[s]?://[^ ]*$'))
                        .guard(url, `URL_ANALYSER_CONFIG.urls.registry.${url}`);
                }),
            ])
            .combine();
    }

    /**
     * Merges URL scrolling options into default scrolling options.
     * @param url
     * @returns
     */
    public static getUrlScrollingOptions(url: string): IScrollingOptions {
        return {
            ...HTTP_ANALYSER_CONFIG.urls.default.scrolling,
            ...(
                new Map(Object.entries(HTTP_ANALYSER_CONFIG.urls.registry)) as Map<
                    string,
                    { scrolling: IScrollingOptions }
                >
            ).get(url)?.scrolling,
        };
    }
}
