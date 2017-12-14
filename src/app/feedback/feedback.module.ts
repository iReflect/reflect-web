import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { FeedbackFormComponent } from './feedback-form/feedback-form.component';
import { BooleanQuestionComponent } from './feedback-form/question/boolean-question.component';
import { GradeQuestionComponent } from './feedback-form/question/grade-question.component';
import { MultiChoiceQuestionComponent } from './feedback-form/question/multi-choice-question.component';
import { FeedbackRoutingModule } from './feedback-routing.module';
import { FeedbackFormService } from './feedback-form/feedback-form.service';
import { BaseQuestionComponent } from './feedback-form/question/question.base.component';
import { CustomMaterialModule } from '../core/custom-material/custom-material.module';

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
