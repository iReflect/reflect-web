import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { LoaderState } from './loader';

@Injectable()
export class LoaderService {
    private loaderSubject$ = new Subject<LoaderState>();

    pendingRequests = 0;
    loaderState$ = this.loaderSubject$.asObservable();

    constructor() {
    }

    show() {
        this.pendingRequests++;
        this.loaderSubject$.next(<LoaderState>{show: true});
    }

    hide() {
        this.pendingRequests--;
        if (this.pendingRequests === 0) {
            this.loaderSubject$.next(<LoaderState>{show: false});
        }
    }
}
