import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { APP_ROUTE_URLS, LOGIN_ERROR_MESSAGES, LOGIN_ERROR_TYPES, LOGIN_STATES } from '../../../constants/app-constants';
import { AuthService } from '../../shared/services/auth.service';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';
import { PostMessageService } from '../../shared/services/post-message.service';
import { UserStoreService } from '../../shared/stores/user.store.service';
import { Location } from '@angular/common';
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
        private postMessageService: PostMessageService,
        private location: Location,
        private userStoreService: UserStoreService
    ) {
        this.postMessageService.addPostMessageListener((event) => this.receiveMessage(event));
    }

    ngOnInit() {
        this.setLoginUrl();
        this.setErrorIfExist();
    }

    ngOnDestroy() {
        this.destroy$.next(true);
        this.destroy$.complete();
    }

    // setReturnUrl() {
    //     this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || APP_ROUTE_URLS.forwardSlash;
    // }

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

    setLoginUrl() {
        this.returnURL = this.route.snapshot.queryParams['returnUrl'] || APP_ROUTE_URLS.forwardSlash;
        this.authService.login()
            .takeUntil(this.destroy$)
            .subscribe(response => this.loginUrl = response.data['LoginURL']);
    }

    openLoginModal() {
        const options = 'left=100,top=10,width=400,height=400';
        window.open(this.loginUrl, 'loginPopup', options);
    }

    receiveMessage(event) {
        if (event.origin === window.location.origin && event.data) {
            const authParams = ['code', 'state'];
            const eventDataParams = Object.keys(event.data).sort();
            if (_.isEqual(authParams, eventDataParams) && !this.isAuthorizing) {
                this.isAuthorizing = true;
                this.authorize(event.data);
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
            .subscribe(
            response => {
                this.userStoreService.updateUserData(response.data);
                this.router.navigateByUrl(this.returnURL);
                this.authState = this.loginStates.LOGGED_IN;
                this.postMessageService.removePostMessageListener((event) => this.receiveMessage(event));
            },
            error => {
                if (error.status === 404) {
                    this.error(LOGIN_ERROR_TYPES.notFound);
                } else {
                    this.error(LOGIN_ERROR_TYPES.internalError);
                }
            },
            () => {
                this.isAuthorizing = false;
            }
        );
    }

    private error(reason) {
        this.errorMessage = LOGIN_ERROR_MESSAGES[reason];
        this.router.navigate([APP_ROUTE_URLS.login], {queryParams: {error: reason},
            queryParamsHandling: 'merge'});
    }
}
