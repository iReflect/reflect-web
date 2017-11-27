import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home.component';
import { LoginRequiredGuard } from '../core/route-guards/login-required.service';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [LoginRequiredGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
