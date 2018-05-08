import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { APP_ROUTE_URLS, LOGIN_ERROR_MESSAGES } from '../../../constants/app-constants';
import { AuthService } from '../../shared/services/auth.service';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

    title: String = 'Sign In';
    button_text: String = 'LOGIN WITH GOOGLE';
    returnUrl = '';
    loginUrl = '';
    showError = false;
    errorMessage = '';

    private destroy$: Subject<boolean> = new Subject<boolean>();

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private authService: AuthService
    ) {
    }

    ngOnInit() {
        this.setLoginUrl();
        this.setReturnUrl();
        this.setErrorIfExist();
    }

    ngOnDestroy() {
        this.destroy$.next(true);
        this.destroy$.complete();
    }

    setReturnUrl() {
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || APP_ROUTE_URLS.forwardSlash;
    }

    setErrorIfExist() {
        const error = this.route.snapshot.queryParams['error'] || '';
        this.showError = error !== '';
        if (this.showError) {
            this.errorMessage = LOGIN_ERROR_MESSAGES[error] || LOGIN_ERROR_MESSAGES.internalError;
        }
    }

    setLoginUrl() {
        this.authService.login()
            .takeUntil(this.destroy$)
            .subscribe(response => this.loginUrl = response.data['LoginURL']);
    }
}
