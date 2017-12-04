import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Import Components
import { FeedbackFormComponent } from './feedback-form/feedback-form.component';

// Import Guards
import {LoginRequiredGuard} from '../core/route-guards/login-required.service';

const routes: Routes = [
  {
    path: 'feedback-event/:id',
    component: FeedbackFormComponent,
    pathMatch: 'prefix',
    canActivate: [LoginRequiredGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FeedbackRoutingModule { }
