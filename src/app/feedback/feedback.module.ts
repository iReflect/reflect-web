import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomMaterialModule } from '../core/custom-material/custom-material.module';
import { SharedModule } from '../shared/shared.module';
import { FeedbackListComponent } from './feedback-list/feedback-list.component';
import { FeedBackListDataSource } from './feedback-list/feedback-list.data-source';
import { FeedbackDetailComponent } from './feedback-detail/feedback-detail.component';
import { BooleanQuestionComponent } from './feedback-detail/question/boolean-question.component';
import { GradeQuestionComponent } from './feedback-detail/question/grade-question.component';
import { MultiChoiceQuestionComponent } from './feedback-detail/question/multi-choice-question.component';
import { FeedbackRoutingModule } from './feedback-routing.module';

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
        FeedbackListComponent
    ],
    exports: [],
    schemas: [
        FeedBackListDataSource
    ],
    providers: []
})
export class FeedbackModule {
}
