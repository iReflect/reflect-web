import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// Import App Constants
import { APP_ROUTE_URLS } from '../../constants/app-constants';
// Import Guards
import { LoginRequiredGuard } from '../core/route-guards/login-required.service';
// Import Components
import { FeedbackDetailComponent } from './feedback-detail/feedback-detail.component';
import { FeedbackListComponent } from './feedback-list/feedback-list.component';

const routes: Routes = [
    {
        path: APP_ROUTE_URLS.feedback,
        component: FeedbackDetailComponent,
        pathMatch: 'prefix',
        canActivate: [LoginRequiredGuard]
    },
    {
        path: APP_ROUTE_URLS.feedbackList,
        component: FeedbackListComponent,
        pathMatch: 'prefix',
        canActivate: [LoginRequiredGuard]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class FeedbackRoutingModule {
}
