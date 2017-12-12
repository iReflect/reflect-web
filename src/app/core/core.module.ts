import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// Import Custom Modules
import { SharedModule } from '../shared/shared.module';

// Import Custom Services
import { LoginRequiredGuard } from './route-guards/login-required.service';
import { AnonymousRequiredGuard } from './route-guards/anonymous-required.service';

// Import Others
import { throwIfAlreadyLoaded } from './module-import-guard';
import { LoggerService } from './logger.service';
import { CustomMaterialModule } from './custom-material/custom-material.module';
import { HeaderComponent } from './layout/header/header.component';

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
  ],
  providers: [
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
