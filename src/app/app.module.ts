import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { CookieModule } from 'ngx-cookie';
import { APP_ROUTE_URLS } from '@constants/app-constants';
import { AccountModule } from 'app/account/account.module';
import { AppComponent } from 'app/app.component';
import { CoreModule } from 'app/core/core.module';
import { CustomMaterialModule } from 'app/core/custom-material/custom-material.module';
import { FeedbackModule } from 'app/feedback/feedback.module';
import { HomeModule } from 'app/home/home.module';
import { SharedModule } from 'app/shared/shared.module';
import { SideNavComponent } from 'app/sidenav/sidenav.component';
import { RetrospectiveModule } from 'app/retrospective/retrospective.module';
import { LicenseManager } from 'ag-grid-enterprise';
import { AppConfig } from './app.config';
import { AppEnvConfig } from './app-config.model';
import { IsMaintenanceModeActiveGuard } from './core/route-guards/is-maintenance-mode-active.service';
import { MaintenanceComponent } from './maintenance/maintenance.component';

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
                        AppConfig.settings = new AppEnvConfig(response.data);
                        if (!AppConfig.settings.isValid()) {
                            appConfig.router.navigateByUrl(APP_ROUTE_URLS.maintenance);
                        }
                        if (AppConfig.settings.useAgGridEnterprise) {
                            LicenseManager.setLicenseKey(AppConfig.settings.agGridLicenseKey);
                        }
                        resolve();
                    },
                    (error: any) => {
                        resolve();
                        // If the config file is not found, then redirect user to the maintenance page
                        console.log(error);
                        AppConfig.settings = new AppEnvConfig();
                        appConfig.router.navigateByUrl(APP_ROUTE_URLS.maintenance);
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
