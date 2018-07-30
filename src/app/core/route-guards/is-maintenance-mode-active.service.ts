import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';

import * as _ from 'lodash';

import { APP_ROUTE_URLS } from '../../../constants/app-constants';
import { AppConfig } from '../../app.config';

@Injectable()
export class IsMaintenanceModeActiveGuard implements CanActivate {

    static isAppUnderMaintenance = false;

    constructor(private router: Router) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (_.isEmpty(AppConfig.settings)) {
            IsMaintenanceModeActiveGuard.isAppUnderMaintenance = true;
            return true;
        }
        this.router.navigateByUrl(APP_ROUTE_URLS.forwardSlash);
        return false;
    }

}
