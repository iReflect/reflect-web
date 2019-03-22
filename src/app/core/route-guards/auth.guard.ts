import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';

import { APP_ROUTE_URLS } from '@constants/app-constants';
import { AuthService } from 'app/shared/services/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private authService: AuthService,
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
    ): Observable<boolean> | Promise<boolean> | boolean {

    const emailAndTimeData = this.authService.getEmailAndReSendTime();

    if (!emailAndTimeData.email || !emailAndTimeData.reSendTime) {
      this.router.navigateByUrl(APP_ROUTE_URLS.forwardSlash);
      return false;
    }
    if (next.routeConfig.path === APP_ROUTE_URLS.updatePassword && !this.authService.getOTP()) {
      this.router.navigateByUrl(APP_ROUTE_URLS.forwardSlash);
      return false;
    }
    return true;
  }
}
