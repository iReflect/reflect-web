import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CustomMaterialModule } from 'app/core/custom-material/custom-material.module';
// Services
import { SharedModule } from 'app/shared/shared.module';
import { FeedbackDetailComponent } from 'app/feedback/feedback-detail/feedback-detail.component';

import { BooleanQuestionComponent } from 'app/feedback/question/boolean-question.component';
import { GradeQuestionComponent } from 'app/feedback/question/grade-question.component';
import { MultiChoiceQuestionComponent } from 'app/feedback/question/multi-choice-question.component';
import { FeedbackListComponent } from 'app/feedback/feedback-list/feedback-list.component';
// Data Source
import { FeedBackListDataSource } from 'app/feedback/feedback-list/feedback-list.data-source';
// Routing
import { FeedbackRoutingModule } from 'app/feedback/feedback-routing.module';
import { MyFeedbackDetailComponent } from 'app/feedback/my-feedback-detail/my-feedback-detail.component';
import { MyFeedbackListComponent } from 'app/feedback/my-feedback-list/my-feedback-list.component';
import { TeamFeedbackDetailComponent } from 'app/feedback/team-feedback-detail/team-feedback-detail.component';
import { TeamFeedbackListComponent } from 'app/feedback/team-feedback-list/team-feedback-list.component';
import { CategoryComponent } from 'app/feedback/category/category.component';
import { SkillComponent } from 'app/feedback/skill/skill.component';
import { QuestionResponseComponent } from 'app/feedback/question-response/question-response.component';

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
        QuestionResponseComponent,
        SkillComponent,
        CategoryComponent,
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
