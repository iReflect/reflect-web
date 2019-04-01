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

    // check if email exists or not, if not we redirect the user to the login page.
    if (!emailAndTimeData.email) {
      this.router.navigateByUrl(APP_ROUTE_URLS.forwardSlash);
      return false;
    }
    // checking if this is update password page or not.
    // if yes then OTP exists or not.
    if (next.routeConfig.path === APP_ROUTE_URLS.updatePassword && !this.authService.getOTP()) {
      this.router.navigateByUrl(APP_ROUTE_URLS.forwardSlash);
      return false;
    }
    return true;
  }
}
