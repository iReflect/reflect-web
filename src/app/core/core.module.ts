import { NgModule, Optional, SkipSelf } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// Import Custom Modules
import { SharedModule } from '../shared/shared.module';

// Import Custom Services
import { ApiService } from './api/api.service';
import { ApiUrlService } from './api/api-url.service';
import { LoginRequiredGuard } from './route-guards/login-required.service';
import { AnonymousRequiredGuard } from './route-guards/anonymous-required.service';

// Import Others
import { throwIfAlreadyLoaded } from './module-import-guard';
import { LoggerService } from './logger.service';

@NgModule({
  imports: [
    HttpClientModule,
    FormsModule,
    SharedModule,
  ],
  declarations: [],
  exports: [],
  providers: [
    ApiService,
    ApiUrlService,
    LoggerService,
    LoginRequiredGuard,
    AnonymousRequiredGuard,
  ],
})

export class CoreModule {
  constructor( @Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }
}
