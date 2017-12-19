import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomMaterialModule } from '../core/custom-material/custom-material.module';
import { SharedModule } from '../shared/shared.module';
import { FeedbackListComponent } from './feedback-list/feedback-list.component';
import { FeedBackListDataSource } from './feedback-list/feedback-list.data-source';
import { FeedbackListService } from './feedback-list/feedback-list.service';
import { FeedbackDetailComponent } from './feedback-detail/feedback-detail.component';
import { FeedbackDetailService } from './feedback-detail/feedback-detail.service';
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
    providers: [
        FeedbackDetailService,
        FeedbackListService
    ]
})
export class FeedbackModule {
}
