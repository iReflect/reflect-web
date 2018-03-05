import { AfterViewInit, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { APP_ROUTE_URLS, LOGIN_ERROR_TYPES } from '../../../constants/app-constants';
import { AuthService } from '../../shared/services/auth.service';
import { UserStoreService } from '../../shared/stores/user.store.service';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements AfterViewInit {

    title: String = 'Sign in';

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private authService: AuthService,
        private userStoreService: UserStoreService
    ) {
    }

    ngAfterViewInit(): void {
        this.authorize();
    }

    authorize() {
        const queryParams = {
            code: this.route.snapshot.queryParams['code'] || '',
            state: this.route.snapshot.queryParams['state'] || ''
        };
        if (queryParams.state === '' || queryParams.code === '') {
            this.error(LOGIN_ERROR_TYPES.notFound);
            return;
        }
        this.authService.auth(queryParams).subscribe(
            response => {
                this.userStoreService.updateUserData(response.data);
                this.router.navigateByUrl(APP_ROUTE_URLS.root);
            },
            error => {
                if (error.status == 404) {
                    this.error(LOGIN_ERROR_TYPES.notFound);
                } else {
                    this.error(LOGIN_ERROR_TYPES.internalError);
                }
            }
        );
    }

    error(reason) {
        this.router.navigateByUrl(`${APP_ROUTE_URLS.login}?error=${reason}`);
    }
}
