import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CustomMaterialModule } from 'app/core/custom-material/custom-material.module';
import { SharedModule } from 'app/shared/shared.module';

import { AccountRoutingModule } from 'app/account/account-routing.module';
import { LoginComponent } from 'app/account/login/login.component';
import { AuthComponent } from 'app/account/auth/auth.component';
import { IdentifyComponent } from './identify/identify.component';

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
    ],
    exports: [],
    providers: []
})
export class AccountModule {
}
