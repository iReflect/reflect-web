import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
// Import Custom Modules
import { SharedModule } from 'app/shared/shared.module';
import { CustomMaterialModule } from 'app/core/custom-material/custom-material.module';
import { HeaderComponent } from 'app/core/layout/header/header.component';
import { LoggerService } from 'app/core/logger.service';
// Import Others
import { throwIfAlreadyLoaded } from 'app/core/module-import-guard';
import { AuthGuard } from 'app/core/route-guards/auth.guard';
import { AnonymousRequiredGuard } from 'app/core/route-guards/anonymous-required.service';
// Import Custom Services
import { LoginRequiredGuard } from 'app/core/route-guards/login-required.service';
import { IsMaintenanceModeActiveGuard } from 'app/core/route-guards/is-maintenance-mode-active.service';
import { RestangularModule } from 'ngx-restangular';

// Import LoadingBarModule:
import { LoadingBarModule, LoadingBarService } from '@ngx-loading-bar/core';

export function RestangularConfigFactory(RestangularProvider, loaderService) {
    RestangularProvider.setDefaultHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    });
    RestangularProvider.setDefaultHttpFields({withCredentials: true});
    RestangularProvider.setFullResponse(true);
}

@NgModule({
    imports: [
        RestangularModule.forRoot([LoadingBarService], RestangularConfigFactory),
        CommonModule,
        HttpClientModule,
        FormsModule,
        SharedModule,
        CustomMaterialModule,
        LoadingBarModule.forRoot()
    ],
    declarations: [
        HeaderComponent
    ],
    exports: [
        RestangularModule,
        HeaderComponent,
        CustomMaterialModule,
        LoadingBarModule
    ],
    providers: [
        LoggerService,
        LoginRequiredGuard,
        AnonymousRequiredGuard,
        AuthGuard,
        IsMaintenanceModeActiveGuard,
        {provide: MAT_DATE_LOCALE, useValue: 'en'},
        {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
        {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
    ],
})

export class CoreModule {
    constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
        throwIfAlreadyLoaded(parentModule, 'CoreModule');
    }
}
