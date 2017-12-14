import { Component, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseQuestionComponent } from './question.base.component';
import { GRADE_TYPE_QUESTION, QUESTION_TYPE_MAP } from '../../../../constants/app-constants';

@Component({
  selector: 'app-grade-question',
  templateUrl: './grade-question.component.html',
  styleUrls: ['./grade-question.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => GradeQuestionComponent),
      multi: true
    }
  ]
})
export class GradeQuestionComponent extends BaseQuestionComponent {
  constructor() {
    super();
    this.type = QUESTION_TYPE_MAP[GRADE_TYPE_QUESTION];
  }
}