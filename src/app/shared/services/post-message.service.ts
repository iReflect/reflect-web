import { Injectable } from '@angular/core';

@Injectable()
export class PostMessageService {
    addPostMessageListener(eventListener: EventListener): void {
        window.addEventListener('message', eventListener, false);
    }

    removePostMessageListener(eventListener: EventListener): void {
        window.removeEventListener('message', eventListener, false);
    }
}
