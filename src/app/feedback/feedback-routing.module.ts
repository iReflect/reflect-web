import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// Import App Constants
import { APP_ROUTE_URLS } from '../../constants/app-constants';
// Import Guards
import { LoginRequiredGuard } from '../core/route-guards/login-required.service';
// Import Components
import { MyFeedbackListComponent } from './my-feedback-list/my-feedback-list.component';
import { MyFeedbackDetailComponent } from './my-feedback-detail/my-feedback-detail.component';
import { TeamFeedbackListComponent } from './team-feedback-list/team-feedback-list.component';
import { TeamFeedbackDetailComponent } from './team-feedback-detail/team-feedback-detail.component';

const routes: Routes = [
    // TODO: Enable Feedbacks
    // {
    //     path: APP_ROUTE_URLS.feedback,
    //     component: MyFeedbackDetailComponent,
    //     pathMatch: 'prefix',
    //     canActivate: [LoginRequiredGuard]
    // },
    // {
    //     path: APP_ROUTE_URLS.feedbackList,
    //     component: MyFeedbackListComponent,
    //     pathMatch: 'prefix',
    //     canActivate: [LoginRequiredGuard]
    // },
    // {
    //     path: APP_ROUTE_URLS.teamFeedback,
    //     component: TeamFeedbackDetailComponent,
    //     pathMatch: 'prefix',
    //     canActivate: [LoginRequiredGuard]
    // },
    // {
    //     path: APP_ROUTE_URLS.teamFeedbackList,
    //     component: TeamFeedbackListComponent,
    //     pathMatch: 'prefix',
    //     canActivate: [LoginRequiredGuard]
    // }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class FeedbackRoutingModule {
}
