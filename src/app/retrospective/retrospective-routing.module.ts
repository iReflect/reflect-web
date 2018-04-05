import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// Import App Constants
import { APP_ROUTE_URLS } from '../../constants/app-constants';
// Import Guards
import { LoginRequiredGuard } from '../core/route-guards/login-required.service';
// Import Components
import { RetrospectiveListComponent } from './retrospective-list/retrospective-list.component';
import { SprintDetailComponent } from './sprint-detail/sprint-detail.component';
import { RetrospectiveDashboardComponent } from './retrospective-dashboard/retrospective-dashboard.component';

const routes: Routes = [
    {
        path: APP_ROUTE_URLS.retrospectiveList,
        component: RetrospectiveListComponent,
        canActivate: [LoginRequiredGuard]
    },
    {
        path: APP_ROUTE_URLS.sprintDetails,
        component: SprintDetailComponent,
        canActivate: [LoginRequiredGuard]
    },
    {
        path: APP_ROUTE_URLS.retrospectiveDashboard,
        component: RetrospectiveDashboardComponent,
        canActivate: [LoginRequiredGuard]
    },
    {
        path: APP_ROUTE_URLS.retrospectiveDetail,
        redirectTo: APP_ROUTE_URLS.retrospectiveDashboard,
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RetrospectiveRoutingModule {
}
