import { Component, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseQuestionComponent } from 'app/feedback/question/question.base.component';

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
    }

    onOpenedChange() {
        this.onTouchedCallback();
    }
}
