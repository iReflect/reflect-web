import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Import Components
import { FeedbackFormComponent } from './feedback-form/feedback-form.component';
import { FeedbackFormListComponent } from './feedback-form-list/feedback-form-list.component';

// Import Guards
import { LoginRequiredGuard } from '../core/route-guards/login-required.service';

// Import App Constants
import { APP_ROUTE_URLS } from '../../constants/app-constants';

const routes: Routes = [
  {
    path: APP_ROUTE_URLS.feedback,
    component: FeedbackFormComponent,
    pathMatch: 'prefix',
    canActivate: [LoginRequiredGuard]
  },
  {
    path: APP_ROUTE_URLS.feedbackList,
    component: FeedbackFormListComponent,
    pathMatch: 'prefix',
    canActivate: [LoginRequiredGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FeedbackRoutingModule { }
