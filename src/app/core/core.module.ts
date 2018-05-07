import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
// Import Custom Modules
import { SharedModule } from '../shared/shared.module';
import { CustomMaterialModule } from './custom-material/custom-material.module';
import { HeaderComponent } from './layout/header/header.component';
import { LoggerService } from './logger.service';
// Import Others
import { throwIfAlreadyLoaded } from './module-import-guard';
import { AnonymousRequiredGuard } from './route-guards/anonymous-required.service';
// Import Custom Services
import { LoginRequiredGuard } from './route-guards/login-required.service';
import { LoaderComponent } from './loader/loader.component';
import { LoaderService } from './loader/loader.service';
import { RestangularModule } from 'ngx-restangular';

export function RestangularConfigFactory(RestangularProvider, loaderSrevice) {
    RestangularProvider.setDefaultHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    });
    RestangularProvider.setRequestSuffix('/');
    RestangularProvider.setDefaultHttpFields({withCredentials: true});
    RestangularProvider.setFullResponse(true);

    RestangularProvider.addFullRequestInterceptor(() => {
        loaderSrevice.show();
    });
    RestangularProvider.addResponseInterceptor(data => {
        loaderSrevice.hide();
        return data;
    });
    RestangularProvider.addErrorInterceptor(data => {
        loaderSrevice.hide();
        return data;
    });
}

@NgModule({
    imports: [
        RestangularModule.forRoot([LoaderService], RestangularConfigFactory),
        CommonModule,
        HttpClientModule,
        FormsModule,
        SharedModule,
        CustomMaterialModule,
    ],
    declarations: [
        HeaderComponent,
        LoaderComponent
    ],
    exports: [
        RestangularModule,
        HeaderComponent,
        CustomMaterialModule,
        LoaderComponent
    ],
    providers: [
        LoaderService,
        LoggerService,
        LoginRequiredGuard,
        AnonymousRequiredGuard,
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
