import { Injectable } from '@angular/core';
import { OAUTH_CALLBACK_EVENT_KEY } from '../../../constants/app-constants';

@Injectable()
export class OAuthCallbackService {

    private _eventListener: EventListener;

    addOAuthEventListener(eventListener: EventListener): void {
        this._eventListener = eventListener;
        window.addEventListener(OAUTH_CALLBACK_EVENT_KEY, eventListener, false);
    }

    removeOAuthEventListener(eventListener?: EventListener): void {
        const listener = eventListener || this._eventListener;
        window.removeEventListener(OAUTH_CALLBACK_EVENT_KEY, listener, false);
    }
}
