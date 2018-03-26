import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// Import App Constants
// Import Guards
// Import Components

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
