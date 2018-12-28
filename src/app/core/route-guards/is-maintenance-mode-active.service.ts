import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';

import * as _ from 'lodash';

import { AppConfig } from 'app/app.config';
import { APP_ROUTE_URLS } from '@constants/app-constants';

@Injectable()
export class IsMaintenanceModeActiveGuard implements CanActivate {

    static isAppUnderMaintenance = false;

    constructor(private router: Router) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (!AppConfig.settings.isValid()) {
            IsMaintenanceModeActiveGuard.isAppUnderMaintenance = true;
            return true;
        }
        this.router.navigateByUrl(APP_ROUTE_URLS.forwardSlash);
        return false;
    }

}
