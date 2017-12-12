import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { AccountRoutingModule } from './account-routing.module';
import { LoginComponent } from './login/login.component';
import { SharedModule } from '../shared/shared.module';
import { CustomMaterialModule } from '../core/custom-material/custom-material.module';
import { LoginService } from './login/login.service';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    AccountRoutingModule,
    CustomMaterialModule
  ],
  declarations: [
    LoginComponent
  ],
  exports: [],
  providers: [
    LoginService
  ]
})
export class AccountModule {}
