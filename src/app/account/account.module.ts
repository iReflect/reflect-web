import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { AccountRoutingModule } from './account-routing.module';
import {LoginComponent} from './login/login.component';
import { SharedModule } from '../shared/shared.module';
import { MyOwnCustomMaterialModule } from '../my-own-custom-material.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    AccountRoutingModule,
    MyOwnCustomMaterialModule
  ],
  declarations: [
    LoginComponent
  ],
  exports: []
})
export class AccountModule {}
