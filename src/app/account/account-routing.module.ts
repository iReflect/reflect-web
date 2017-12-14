import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { APP_ROUTE_URLS } from '../../constants/app-constants';

// Import Components
import { LoginComponent } from './login/login.component';

// Import Guards
import { AnonymousRequiredGuard } from '../core/route-guards/anonymous-required.service';

const routes: Routes = [
  {
    path: APP_ROUTE_URLS.login,
    component: LoginComponent,
    canActivate: [AnonymousRequiredGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule { }
