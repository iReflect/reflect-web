import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Import Components
import { HomeComponent } from './home.component';

// Import Guards
import { LoginRequiredGuard } from '../core/route-guards/login-required.service';

// Import App Constants
import { APP_ROUTE_URLS } from '../../constants/app-constants';

const routes: Routes = [
  {
    path: APP_ROUTE_URLS.root,
    component: HomeComponent,
    canActivate: [LoginRequiredGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
