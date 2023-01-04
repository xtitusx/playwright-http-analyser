import { Page } from '@playwright/test';
import { Tyr } from '@xtitusx/type-guard';

import { Session } from './session';
import { SessionType } from './session-type.enum';
import { ChromeSession } from './chrome.session';

export class SessionFactory {
    private static INSTANCE: SessionFactory;

    private constructor() {}

    public static getInstance(): SessionFactory {
        if (!SessionFactory.INSTANCE) {
            SessionFactory.INSTANCE = new SessionFactory();
        }

        return SessionFactory.INSTANCE;
    }

    /**
     * @param sessionType
     * @throws {RangeError} If sessionType value is not correctly set.
     */
    public create(sessionType: SessionType, page: Page): Session {
        let session: Session;

        const guardResult = Tyr.string().isIn(Object.values(SessionType)).guard(sessionType);

        if (!guardResult.isSuccess()) {
            throw new RangeError(guardResult.getMessage());
        }

        switch (sessionType) {
            case SessionType.CHROME: {
                session = new ChromeSession(page);
                break;
            }
            default: {
                session = new Session(page);
                break;
            }
        }

        return session;
    }
}
