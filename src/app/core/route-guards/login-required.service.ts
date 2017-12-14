import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import * as _ from 'lodash';

// App Constants
import { APP_ROUTE_URLS } from '../../../constants/app-constants';

// Custom Services
import { UserDataStoreService } from '../../shared/data-stores/user-data-store.service';


@Injectable()
export class LoginRequiredGuard implements CanActivate {

    userLoggedIn = false;

    constructor(private router: Router, private userService: UserDataStoreService) {

        this.userService.token$.subscribe(
            token => this.userLoggedIn = Boolean(token)
        );
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

        if (this.userLoggedIn) {
            this.userService.userData$.subscribe(
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
        this.router.navigateByUrl(APP_ROUTE_URLS.login, { queryParams: { returnUrl: state.url }});
        return false;
    }
}
