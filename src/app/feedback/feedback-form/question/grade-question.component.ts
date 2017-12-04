import { Component, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseQuestionComponent } from './question.base.component';

@Component({
  selector: 'app-grade-question',
  templateUrl: './grade-question.component.html',
  styles: [''],
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
    this.type = 'grade';
  }
}
