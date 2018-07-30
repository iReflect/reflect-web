import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { APP_ROUTE_URLS, LOGIN_ERROR_MESSAGES, LOGIN_ERROR_TYPES, LOGIN_STATES } from '../../../constants/app-constants';
import { AuthService } from '../../shared/services/auth.service';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/finally';
import 'rxjs/add/operator/takeUntil';
import { OAuthCallbackService } from '../../shared/services/o-auth-callback.service';
import { UserStoreService } from '../../shared/stores/user.store.service';
import * as _ from 'lodash';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

    title: String = 'Sign In';
    authState = LOGIN_STATES.NOT_LOGGED_IN;
    button_text: String = 'LOGIN WITH GOOGLE';
    loginStates = LOGIN_STATES;
    loginUrl = '';
    showError = false;
    _errorMessage = '';
    isAuthorizing = false;
    returnURL = APP_ROUTE_URLS.root;

    private destroy$: Subject<boolean> = new Subject<boolean>();

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private authService: AuthService,
        private oAuthCallbackService: OAuthCallbackService,
        private userStoreService: UserStoreService
    ) {
        this.oAuthCallbackService.addOAuthEventListener((event) => this.receiveMessage(event));
    }

    ngOnInit() {
        this.setReturnURL();
        this.setLoginUrl();
        this.setErrorIfExist();
    }

    ngOnDestroy() {
        this.destroy$.next(true);
        this.destroy$.complete();
    }

    setErrorIfExist() {
        const error = this.route.snapshot.queryParams['error'] || '';
        this.showError = error !== '';
        if (this.showError) {
            this.errorMessage = LOGIN_ERROR_MESSAGES[error] || LOGIN_ERROR_MESSAGES.internalError;
        }
    }

    get errorMessage() {
        return this._errorMessage;
    }

    set errorMessage(message) {
        this._errorMessage = message;
        if (this._errorMessage !== '') {
            this.showError = true;
            this.authState = this.loginStates.LOGIN_ERROR;
        } else {
            this.showError = false;
        }
    }

    setReturnURL() {
        this.returnURL = this.route.snapshot.queryParams['returnUrl'] || APP_ROUTE_URLS.forwardSlash;
    }

    setLoginUrl() {
        this.loginUrl = '';
        this.authService.login()
            .takeUntil(this.destroy$)
            .subscribe(response => this.loginUrl = response.data['LoginURL']);
    }

    openLoginModal() {
        const options = 'left=100,top=10,width=400,height=400';
        window.open(this.loginUrl, 'loginPopup', options);
    }

    receiveMessage(event) {
        if (event.currentTarget.origin === window.location.origin && event.detail) {
            const authParams = ['code', 'state'];
            const eventDataParams = Object.keys(event.detail).sort();
            if (_.isEqual(authParams, eventDataParams) && !this.isAuthorizing) {
                this.isAuthorizing = true;
                this.authorize(event.detail);
            }
        }
    }

    private authorize(queryParams) {
        this.authState = this.loginStates.LOGGING_IN;
        if (queryParams.state === '' || queryParams.code === '') {
            this.error(LOGIN_ERROR_TYPES.notFound);
            return;
        }
        this.authService.auth(queryParams)
            .takeUntil(this.destroy$)
            .finally(() => {
                this.isAuthorizing = false;
            })
            .subscribe(
            response => {
                this.userStoreService.updateUserData(response.data);
                this.router.navigateByUrl(this.returnURL);
                this.authState = this.loginStates.LOGGED_IN;
                this.oAuthCallbackService.removeOAuthEventListener();
            },
            error => {
                if (error.status === 404) {
                    this.error(LOGIN_ERROR_TYPES.notFound);
                } else {
                    this.error(LOGIN_ERROR_TYPES.internalError);
                }
                // Reset the login URL if the authentication fails, so that user can login again without page refresh.
                this.setLoginUrl();
            }
        );
    }

    private error(reason) {
        this.errorMessage = LOGIN_ERROR_MESSAGES[reason];
        // We need to retain the return url if there was an error while authenticating the user, therefore using 'merge' strategy.
        this.router.navigate([APP_ROUTE_URLS.login], {queryParams: {error: reason}, queryParamsHandling: 'merge'});
    }
}
