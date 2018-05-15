import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { APP_ROUTE_URLS, LOGIN_ERROR_TYPES } from '../../../constants/app-constants';
import { AuthService } from '../../shared/services/auth.service';
import { UserStoreService } from '../../shared/stores/user.store.service';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements AfterViewInit, OnDestroy {

    title: String = 'Sign in';
    private destroy$: Subject<boolean> = new Subject<boolean>();

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

    ngOnDestroy() {
        this.destroy$.next(true);
        this.destroy$.complete();
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
        this.authService.auth(queryParams)
            .takeUntil(this.destroy$)
            .subscribe(
                response => {
                    this.userStoreService.updateUserData(response.data);
                    this.router.navigateByUrl(APP_ROUTE_URLS.root);
                },
                error => {
                    if (error.status === 404) {
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
