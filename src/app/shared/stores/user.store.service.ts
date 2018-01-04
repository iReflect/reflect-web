import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { CookieService } from 'ngx-cookie';
import 'rxjs/add/operator/filter';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { USER_AUTH_TOKEN_KEY } from '../../../constants/app-constants';


@Injectable()
export class UserStoreService {

    private token: BehaviorSubject<string> = new BehaviorSubject(String());

    private initial = '$initial';

    private userData: BehaviorSubject<any> = new BehaviorSubject({[this.initial]: true});

    public userData$ = this.userData.asObservable().filter(data => !(this.initial in data));

    // constructor() {}
    constructor(private cookieService: CookieService) {
    }

    get token$() {

        // Check Cookie
        const cookieToken = this.cookieService.get(USER_AUTH_TOKEN_KEY);

        if (!this.token.getValue() && cookieToken) {
            this.setToken$(cookieToken);
        }
        return this.token.asObservable();
    }

    setToken$(accessToken: string) {

        if (accessToken) {
            this.cookieService.put(USER_AUTH_TOKEN_KEY, accessToken);
        } else {
            this.cookieService.remove(USER_AUTH_TOKEN_KEY);
        }

        this.token.next(accessToken);
    }

    updateUserData(userDict: any, updateToken = true) {
        /*
        Takes an Object and updates User dictionary with its Key-Value pair.
        It also serves as reset function if userDict is empty
        */

        let userValue = this.userData.value;

        const existingToken = this.token.value;
        let token = userDict.Token;

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

        this.userData.next(userValue);
    }

    clearUserData() {
        this.updateUserData({}, true);
    }
}
