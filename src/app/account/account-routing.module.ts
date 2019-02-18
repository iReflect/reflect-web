import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { APP_ROUTE_URLS } from '@constants/app-constants';
// Import Guards
import { AnonymousRequiredGuard } from 'app/core/route-guards/anonymous-required.service';
// Import Components
import { LoginComponent } from 'app/account/login/login.component';
import { AuthComponent } from 'app/account/auth/auth.component';
import { IdentifyComponent } from 'app/account/identify/identify.component';

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
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AccountRoutingModule {
}
