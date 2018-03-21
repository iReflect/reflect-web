import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { APP_ROUTE_URLS } from '../../../../constants/app-constants';
import { AuthService } from '../../../shared/services/auth.service';
import { UserService } from '../../../shared/services/user.service';
import { UserStoreService } from '../../../shared/stores/user.store.service';



@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
    @Input() userLoggedIn: boolean;
    logoutInProgress = false;
    user: any = {};
    userImage = 'assets/img/user-default.png';
    constructor(private router: Router,
                private authService: AuthService,
                private userStoreService: UserStoreService,
                private userService: UserService) {
    }

    subscribeUserData() {
        this.userStoreService.token$.subscribe(
            token => this.userLoggedIn = Boolean(token)
        );
        this.userStoreService.userData$.subscribe(
            data => this.user = data
        );
    }

    ngOnInit() {
        this.userService.getCurrentUser().subscribe(
            response => this.userStoreService.updateUserData(response.data, false)
        );
        this.subscribeUserData();
    }

    navigateToRoot() {
        this.router.navigateByUrl(APP_ROUTE_URLS.root);
    }

    logout() {
        if (!this.logoutInProgress) {
            this.logoutInProgress = true;
            this.authService.logout().subscribe(
                () => {
                    this.userStoreService.clearUserData();
                    this.logoutInProgress = false;
                    this.router.navigateByUrl(APP_ROUTE_URLS.login);
                }
            );
        }
    }
}
