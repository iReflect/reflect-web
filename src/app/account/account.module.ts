import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CustomMaterialModule } from 'app/core/custom-material/custom-material.module';
import { SharedModule } from 'app/shared/shared.module';

import { AccountRoutingModule } from 'app/account/account-routing.module';
import { LoginComponent } from 'app/account/login/login.component';
import { AuthComponent } from 'app/account/auth/auth.component';
import { IdentifyComponent } from 'app/account/identify/identify.component';
import { CodeComponent } from 'app/account/code/code.component';
import { UpdatePasswordComponent } from 'app/account/update-password/update-password.component';

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
        IdentifyComponent,
        CodeComponent,
        UpdatePasswordComponent,
    ],
    exports: [],
    providers: []
})
export class AccountModule {
}
