import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { APP_ROUTE_URLS } from '@constants/app-constants';
// Import Guards
import { AnonymousRequiredGuard } from 'app/core/route-guards/anonymous-required.service';
// Import Components
import { LoginComponent } from 'app/account/login/login.component';
import { AuthComponent } from 'app/account/auth/auth.component';
import { CodeComponent } from 'app/account/code/code.component';
import { IdentifyComponent } from 'app/account/identify/identify.component';
import { UpdatePasswordComponent } from 'app/account/update-password/update-password.component';
import { AuthGuard } from 'app/core/route-guards/auth.guard';

const routes: Routes = [
    {
        path: APP_ROUTE_URLS.auth,
        component: AuthComponent,
        canActivate: [AnonymousRequiredGuard]
    },
    {
        path: APP_ROUTE_URLS.login,
        component: LoginComponent,
        canActivate: [AnonymousRequiredGuard]
    },
    {
        path: APP_ROUTE_URLS.identify,
        component: IdentifyComponent,
        canActivate: [AnonymousRequiredGuard]
    },
    {
        path: APP_ROUTE_URLS.code,
        component: CodeComponent,
        canActivate: [AnonymousRequiredGuard, AuthGuard]
    },
    {
        path: APP_ROUTE_URLS.updatePassword,
        component: UpdatePasswordComponent,
        canActivate: [AnonymousRequiredGuard, AuthGuard]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AccountRoutingModule {
}
