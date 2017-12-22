import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CustomMaterialModule } from '../core/custom-material/custom-material.module';
// Services
import { SharedModule } from '../shared/shared.module';
import { FeedbackDetailComponent } from './feedback-detail/feedback-detail.component';

import { BooleanQuestionComponent } from './feedback-detail/question/boolean-question.component';
import { GradeQuestionComponent } from './feedback-detail/question/grade-question.component';
import { MultiChoiceQuestionComponent } from './feedback-detail/question/multi-choice-question.component';
import { FeedbackListComponent } from './feedback-list/feedback-list.component';
// Data Source
import { FeedBackListDataSource } from './feedback-list/feedback-list.data-source';
// Routing
import { FeedbackRoutingModule } from './feedback-routing.module';
import { MyFeedbackDetailComponent } from './my-feedback-detail/my-feedback-detail.component';
import { MyFeedbackListComponent } from './my-feedback-list/my-feedback-list.component';
import { TeamFeedbackDetailComponent } from './team-feedback-detail/team-feedback-detail.component';
import { TeamFeedbackListComponent } from './team-feedback-list/team-feedback-list.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        FeedbackRoutingModule,
        SharedModule,
        CustomMaterialModule
    ],
    declarations: [
        BooleanQuestionComponent,
        GradeQuestionComponent,
        MultiChoiceQuestionComponent,
        FeedbackDetailComponent,
        FeedbackListComponent,
        MyFeedbackListComponent,
        MyFeedbackDetailComponent,
        TeamFeedbackListComponent,
        TeamFeedbackDetailComponent,
    ],
    exports: [],
    schemas: [
        FeedBackListDataSource
    ],
    providers: []
})
export class FeedbackModule {
}
