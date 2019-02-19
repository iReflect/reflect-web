import { Injectable } from '@angular/core';

import * as CryptoJS from 'crypto-js';
import { Restangular } from 'ngx-restangular';
import { Observable } from 'rxjs/Observable';

import { API_URLS } from '@constants/api-urls';
import { ITERATION_COUNT, KEY_SIZE, SALT_FOR_PASSWORD } from '@constants/app-constants';
import { RestApiHelperService } from 'app/shared/utils/rest-api-helper.service';


@Injectable()
export class AuthService {
    private restangular: Restangular;

    constructor(private restApiHelperService: RestApiHelperService) {
        this.restangular = restApiHelperService.getAuthApiHelper();
    }

    login() {
        return this.restangular.one(API_URLS.login).get();
    }

    basicAuthLogin(loginData: any): Observable<any> {
        return this.restangular.one(API_URLS.login).post('', loginData);
    }

    auth(queryParams: any): Observable<any> {
        return this.restangular.one(API_URLS.auth).post(undefined, undefined, queryParams);
    }

    logout() {
        return this.restangular.one(API_URLS.logout).post();
    }
    encryptPassword(password: string) {
        return CryptoJS.PBKDF2(
            password,
            SALT_FOR_PASSWORD,
            {
                keySize: KEY_SIZE,
                iterations: ITERATION_COUNT
            }).toString();
    }
}
