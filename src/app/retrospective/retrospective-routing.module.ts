import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// Import App Constants
import { APP_ROUTE_URLS } from '../../constants/app-constants';

// Import Guards
import { LoginRequiredGuard } from '../core/route-guards/login-required.service';

// Import Components
import { RetrospectiveListComponent } from './retrospective-list/retrospective-list.component';
import { RetrospectiveCreateComponent } from './retrospective-create/retrospective-create.component';
import { RetrospectiveDashboardComponent } from './retrospective-dashboard/retrospective-dashboard.component';

const routes: Routes = [
    {
        path: APP_ROUTE_URLS.retroSpectiveList,
        component: RetrospectiveListComponent,
        canActivate: [LoginRequiredGuard]
    },
    {
        path: APP_ROUTE_URLS.retroSpectiveCreate,
        component: RetrospectiveCreateComponent,
        canActivate: [LoginRequiredGuard]
    },
    {
        path: APP_ROUTE_URLS.retroSpectiveDashboard,
        component: RetrospectiveDashboardComponent,
        canActivate: [LoginRequiredGuard]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RetrospectiveRoutingModule {
}
