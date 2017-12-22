import { Injectable } from '@angular/core';
import { Restangular } from 'ngx-restangular';
import { Observable } from 'rxjs/Observable';
import { API_URLS } from '../../../constants/api-urls';
import { RestApiHelperService } from "../utils/rest-api-helper.service";


@Injectable()
export class AuthService {
    private restangular: Restangular;

    constructor(private restApiHelperService: RestApiHelperService, r: Restangular) {
        this.restangular = restApiHelperService.getAuthApiHelper();
    }

    login() {
        return this.restangular.one(API_URLS.login).get();
    }

    auth(queryParams: any): Observable<any> {
        return this.restangular.one(API_URLS.auth).get(queryParams);
    }

    logout() {
        return this.restangular.one(API_URLS.logout).post()
    }
}
