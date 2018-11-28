import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { APP_ROUTE_URLS } from '@constants/app-constants';
import { AuthService } from 'app/shared/services/auth.service';
import { UserService } from 'app/shared/services/user.service';
import { UserStoreService } from 'app/shared/stores/user.store.service';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
    @Input() userLoggedIn: boolean;
    logoutInProgress = false;
    user: any = {};
    userImage = 'assets/img/user-default.png';

    private destroy$: Subject<boolean> = new Subject<boolean>();

    constructor(
        private router: Router,
        private authService: AuthService,
        private userStoreService: UserStoreService,
        private userService: UserService
    ) {
    }

    ngOnInit() {
        this.userService.getCurrentUser().takeUntil(this.destroy$).subscribe(
            response => this.userStoreService.updateUserData(response.data, false)
        );
        this.subscribeUserData();
    }

    ngOnDestroy() {
        this.destroy$.next(true);
        this.destroy$.complete();
    }

    subscribeUserData() {
        this.userStoreService.token$.takeUntil(this.destroy$).subscribe(
            token => this.userLoggedIn = Boolean(token)
        );
        this.userStoreService.userData$.takeUntil(this.destroy$).subscribe(
            data => this.user = data
        );
    }

    navigateToRoot() {
        this.router.navigateByUrl(APP_ROUTE_URLS.root);
    }

    logout() {
        if (!this.logoutInProgress) {
            this.logoutInProgress = true;
            this.authService.logout().takeUntil(this.destroy$).subscribe(
                () => {
                    this.userStoreService.clearUserData();
                    this.logoutInProgress = false;
                    this.router.navigateByUrl(APP_ROUTE_URLS.login);
                }
            );
        }
    }
}
