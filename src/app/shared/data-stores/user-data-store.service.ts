import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { CookieService } from 'ngx-cookie';
import 'rxjs/add/operator/filter';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { USER_AUTH_TOKEN_KEY } from '../../../constants/app-constants';


@Injectable()
export class UserDataStoreService {

    private _token: BehaviorSubject<string> = new BehaviorSubject(String());

    private initial = '$initial';

    private _userData: BehaviorSubject<any> = new BehaviorSubject({[this.initial]: true});
    public userData$ = this._userData.asObservable().filter(data => !(this.initial in data));

    // constructor() {}
    constructor(private _cookieService: CookieService) {
    }

    get token$() {

        // Check Cookie
        const cookieToken = this._cookieService.get(USER_AUTH_TOKEN_KEY);

        if (!this._token.getValue() && cookieToken) {
            this.setToken$(cookieToken);
        }
        return this._token.asObservable();
    }

    // We cannot use setter here, since it violates get/set Contract (Setter accepts string, but getter returns Observable)
    setToken$(accessToken: string) {

        // If it is empty String, we are resetting Token (Eg: when we are logging out user, or token expired)
        // Else, we set/update Cookie
        if (accessToken) {
            this._cookieService.put(USER_AUTH_TOKEN_KEY, accessToken);
        } else {
            this._cookieService.remove(USER_AUTH_TOKEN_KEY);
        }

        this._token.next(accessToken);
    }

    // saveUserInfo(data: any) {
    //   if (_.isEmpty(data)) {
    //     this._cookieService.remove('user_info');
    //   }
    //   this._cookieService.put('user_info', JSON.stringify(data));
    // }

    updateUserMultipleValues(userDict: any, updateToken = true) {
        /*
        Takes an Object and updates User dictionary with its Key-Value pair.
        It also serves as reset function if userDict is empty
        */

        let userValue = this._userData.value;

        const existingToken = this._token.value;
        let token = userDict.token;

        if (_.isEmpty(userDict)) {
            userValue = {};
            token = '';
        } else {
            userValue = _.omit(userValue, [this.initial]);
            userValue = Object.assign(userValue, userDict);
        }

        if (token !== existingToken && updateToken) {
            this.setToken$(token);
        }

        this._userData.next(userValue);
    }

    clearUserData() {
        this.updateUserMultipleValues({});
        this.setToken$('');
    }
}
