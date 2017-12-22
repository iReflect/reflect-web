import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';

import * as _ from 'lodash';
// App Constants
import { APP_ROUTE_URLS } from '../../../constants/app-constants';
import { UserStoreService } from '../../shared/stores/user.store.service';


@Injectable()
export class LoginRequiredGuard implements CanActivate {

    userLoggedIn = false;

    constructor(private router: Router, private userStoreService: UserStoreService) {

        this.userStoreService.token$.subscribe(
            token => this.userLoggedIn = Boolean(token)
        );
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

        if (this.userLoggedIn) {
            this.userStoreService.userData$.subscribe(
                user => {
                    if (_.isEmpty(user)) {
                        this.router.navigateByUrl(APP_ROUTE_URLS.login);
                        return false;
                    }
                }
            );
            return true;
        }
        // not logged in so redirect to login page with the return url and return false
        this.router.navigateByUrl(APP_ROUTE_URLS.login, {queryParams: {returnUrl: state.url}});
        return false;
    }
}
