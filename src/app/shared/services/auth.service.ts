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
    private email: string;
    private OTPReSendTime: number;
    private otp: string;

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
    identify(identifyData: any): Observable<any> {
        return this.restangular.one(API_URLS.identify).post('', identifyData);
    }
    recover(recoveryData: any): Observable<any> {
        return this.restangular.one(API_URLS.code).post('', recoveryData);
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
    setEmailAndReSendTime(email: string, reSendTime: number) {
        this.email = email;
        this.OTPReSendTime = reSendTime;
    }
    getEmailAndReSendTime(): any {
        return {'email': this.email, 'reSendTime': this.OTPReSendTime};
    }
    setOTP(otp: string) {
        this.otp = otp;
    }
    getOTP(): string {
        return this.otp;
    }
}
