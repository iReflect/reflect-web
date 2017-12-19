import { Injectable } from '@angular/core';
import { Restangular } from 'ngx-restangular';
import { Observable } from 'rxjs/Observable';
import { ApiURLMap } from '../../../constants/api-urls';


@Injectable()
export class LoginService {
    constructor(private restAngular: Restangular) {
    }

    login(credentials: any): Observable<any> {
        return this.restAngular.one(ApiURLMap.login).post('', credentials);
    }

    logout() {
        return this.restAngular.one(ApiURLMap.logout).post();
    }
}
