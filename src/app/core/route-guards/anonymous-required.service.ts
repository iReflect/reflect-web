import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { APP_ROUTE_URLS } from '../../../constants/app-constants';

import { UserDataStoreService } from '../../shared/data-stores/user-data-store.service';


@Injectable()
export class AnonymousRequiredGuard implements CanActivate {

    userLoggedIn = false;

    constructor(private router: Router, private userService: UserDataStoreService) {

        this.userService.token$.subscribe(
            token => this.userLoggedIn = Boolean(token)
        );
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

        if (!this.userLoggedIn) {
            return true;
        }

        this.router.navigateByUrl(APP_ROUTE_URLS.forwardSlash);
        return false;
    }

}
