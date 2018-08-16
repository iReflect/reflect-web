import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { APP_ROUTE_URLS } from '@constants/app-constants';
import { UserStoreService } from 'app/shared/stores/user.store.service';


@Injectable()
export class AnonymousRequiredGuard implements CanActivate {

    userLoggedIn = false;

    constructor(private router: Router, private userStoreService: UserStoreService) {

        this.userStoreService.token$.subscribe(
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
