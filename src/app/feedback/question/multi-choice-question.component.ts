import { Component, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseQuestionComponent } from 'app/feedback/question/question.base.component';
import { QUESTION_RESPONSE_SEPARATOR, QUESTION_TYPES } from '@constants/app-constants';

@Component({
    selector: 'app-multi-choice-question',
    templateUrl: './multi-choice-question.component.html',
    styleUrls: ['./multi-choice-question.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => MultiChoiceQuestionComponent),
            multi: true
        }
    ]
})
export class MultiChoiceQuestionComponent extends BaseQuestionComponent {
    constructor() {
        super();
    }

    formatValue(value) {
        return value.join(QUESTION_RESPONSE_SEPARATOR);
    }

    writeValue(value: any): void {
        if (this.question.Type === QUESTION_TYPES.MULTIPLE_CHOICE) {
            value = value.split(QUESTION_RESPONSE_SEPARATOR).filter((response) => !!response);
        }
        if (value !== this.selected) {
            this.selected = value;
        }
    }

    onOpenedChange() {
        this.onTouchedCallback();
    }

}
