import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import 'rxjs/add/observable/throw';

import { Observable } from 'rxjs/Observable';

@Injectable()
export class LoggerService {

    // Integrate remote logging infrastructure

    handleError = (error: any) => {
        console.error(error.toString());
        return Observable.throw(error.json());
    }

    constructor(private router: Router) {
    }
}
