import { Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';

import { Restangular } from 'ngx-restangular';

import { AppEnvConfig } from 'app/app-config.model';
import { environment } from '@environments/environment';

@Injectable()
export class AppConfig {

    static settings: AppEnvConfig;

    constructor(private restangular: Restangular, private injector: Injector) {
    }

    loadAppConfig() {
        return this.restangular.one(`assets/config/config.${environment.name}.json`).get();
    }

    // Since we are need Router module to redirect user to maintenance page if the site is down,
    // but can't add it as a dependency because it is creating cyclic dependency, so used injector instead.
    public get router(): Router {
        return this.injector.get(Router);
    }
}
