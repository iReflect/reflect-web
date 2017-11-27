import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';

@Injectable()
export class LoggerService {

    // Integrate remote logging infrastructure

    constructor(private router: Router) {
    }

    handleError = (error: any) => {
        console.error(error.toString());
        return Observable.throw(error.json());
    }
}
