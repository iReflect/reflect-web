import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../shared/shared.module';
import { MyOwnCustomMaterialModule } from '../my-own-custom-material.module';
import { FeedbackFormComponent } from './feedback-form/feedback-form.component';
import { BooleanQuestionComponent } from './feedback-form/question/boolean-question.component';
import { GradeQuestionComponent } from './feedback-form/question/grade-question.component';
import { MultiChoiceQuestionComponent } from './feedback-form/question/multi-choice-question.component';
import { FeedbackRoutingModule } from './feedback-routing.module';
import { FeedbackFormService } from './feedback-form/feedback-form.service';
import { BaseQuestionComponent } from './feedback-form/question/question.base.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FeedbackRoutingModule,
    SharedModule,
    MyOwnCustomMaterialModule
  ],
  declarations: [
    BaseQuestionComponent,
    BooleanQuestionComponent,
    GradeQuestionComponent,
    MultiChoiceQuestionComponent,
    FeedbackFormComponent
  ],
  exports: [],
  providers: [
    FeedbackFormService
  ]
})
export class FeedbackModule {}
