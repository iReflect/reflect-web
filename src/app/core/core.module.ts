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

@NgModule({
    imports: [
        CommonModule,
        HttpClientModule,
        FormsModule,
        SharedModule,
        CustomMaterialModule,
    ],
    declarations: [
        HeaderComponent
    ],
    exports: [
        HeaderComponent,
        CustomMaterialModule
    ],
    providers: [
        LoggerService,
        LoginRequiredGuard,
        AnonymousRequiredGuard,
        {provide: MAT_DATE_LOCALE, useValue: 'en-GB'},
        {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
        {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
    ],
})

export class CoreModule {
    constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
        throwIfAlreadyLoaded(parentModule, 'CoreModule');
    }
}
