import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Restangular } from 'ngx-restangular';
import { APP_ROUTE_URLS, LOGIN_ERROR_TYPES } from '../../../constants/app-constants';
import { environment } from '../../../environments/environment';
import { UserStoreService } from '../stores/user.store.service';

@Injectable()
export class RestApiHelperService {

    private dataRestangular: Restangular;
    private authRestangular: Restangular;

    constructor(
        private restangular: Restangular,
        userStoreService: UserStoreService,
        router: Router
    ) {
        this.restangular = restangular.withConfig(function (RestangularProvider) {
            RestangularProvider.addErrorInterceptor((response) => {
                if (response.status === 401) {
                    userStoreService.clearUserData();
                    const queryParams = {'error': LOGIN_ERROR_TYPES.unauthorized, 'returnUrl':  window.location.pathname};
                    router.navigate([APP_ROUTE_URLS.login], {queryParams: queryParams});
                    return false;
                }
                return true;
            });
            RestangularProvider.setFullResponse(true);

        });
    }

    public getDataApiHelper() {
        if (!this.dataRestangular) {
            this.dataRestangular = this.restangular.withConfig(function (RestangularProvider) {
                    RestangularProvider.setBaseUrl(environment.apiHostUrl + environment.baseApiUrl);
                }
            );
        }
        return this.dataRestangular;

    }

    public getAuthApiHelper() {
        if (!this.authRestangular) {
            this.authRestangular = this.restangular.withConfig(function (RestangularProvider) {
                    RestangularProvider.setBaseUrl(environment.apiHostUrl);
                }
            );
        }
        return this.authRestangular;
    }
}
