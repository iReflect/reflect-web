import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CustomMaterialModule } from '../core/custom-material/custom-material.module';
import { SharedModule } from '../shared/shared.module';

import { AccountRoutingModule } from './account-routing.module';
import { LoginComponent } from './login/login.component';
import { AuthComponent } from './auth/auth.component';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        SharedModule,
        AccountRoutingModule,
        CustomMaterialModule
    ],
    declarations: [
        AuthComponent,
        LoginComponent,
    ],
    exports: [],
    providers: []
})
export class AccountModule {
}
