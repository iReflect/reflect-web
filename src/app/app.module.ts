import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { CookieModule } from 'ngx-cookie';
import { LicenseManager } from 'ag-grid-enterprise';
import { APP_INITIALIZER } from '@angular/core';

import { AppConfig } from './app.config';
import { IAppConfig } from './app-config.model';
import { APP_ROUTE_URLS } from '../constants/app-constants';
import { AccountModule } from './account/account.module';
import { IsMaintenanceModeActiveGuard } from './core/route-guards/is-maintenance-mode-active.service';
import { AppComponent } from './app.component';
import { MaintenanceComponent } from './maintenance/maintenance.component';
import { SideNavComponent } from './sidenav/sidenav.component';
import { CoreModule } from './core/core.module';
import { CustomMaterialModule } from './core/custom-material/custom-material.module';
import { HomeModule } from './home/home.module';
import { FeedbackModule } from './feedback/feedback.module';
import { RetrospectiveModule } from './retrospective/retrospective.module';
import { SharedModule } from './shared/shared.module';

const routes: Routes = [
    {
        path: APP_ROUTE_URLS.maintenance,
        component: MaintenanceComponent,
        canActivate: [IsMaintenanceModeActiveGuard]
    },
    { // Route to redirect to Home page if no url matches
        path: '**',
        // TODO: Enable Feedbacks
        // redirectTo: APP_ROUTE_URLS.root,
        redirectTo: APP_ROUTE_URLS.retrospectiveList,
    }
];

// Defines what happens when the app gets initialized
export function onAppInit(appConfig: AppConfig) {
    return () => {
        return new Promise((resolve, reject) => {
            appConfig.loadAppConfig()
                .subscribe(
                    (response: any) => {
                        AppConfig.settings = <IAppConfig>response.data;
                        if (AppConfig.settings.agGridSettings.useEnterprise) {
                            LicenseManager.setLicenseKey(AppConfig.settings.agGridSettings.licenseKey);
                        }
                        resolve();
                    },
                    (error: any) => {
                        console.log(error);
                        // If the config file is not found, then redirect user to the maintenance page
                        appConfig.router.navigateByUrl(APP_ROUTE_URLS.maintenance);
                        resolve();
                    }
                );
        });
    };
}

@NgModule({
    declarations: [
        AppComponent,
        SideNavComponent,
        MaintenanceComponent
    ],
    imports: [
        CommonModule,
        BrowserModule,
        HttpClientModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        CookieModule.forRoot(),
        RouterModule.forRoot(routes, {useHash: false}),
        CustomMaterialModule,
        CoreModule,
        SharedModule,
        HomeModule,
        AccountModule,
        FeedbackModule,
        RetrospectiveModule,
    ],
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
    ],
    providers: [
        AppConfig,
        {
            provide: APP_INITIALIZER,
            useFactory: onAppInit,
            deps: [AppConfig],
            multi: true
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
