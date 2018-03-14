import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// Import App Constants
import { APP_ROUTE_URLS } from '../../constants/app-constants';
// Import Guards
import { LoginRequiredGuard } from '../core/route-guards/login-required.service';
// Import Components
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [
    {
        path: APP_ROUTE_URLS.root,
        redirectTo: APP_ROUTE_URLS.retrospectiveList,
        pathMatch: 'full',
        canActivate: [LoginRequiredGuard]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class HomeRoutingModule {
}
