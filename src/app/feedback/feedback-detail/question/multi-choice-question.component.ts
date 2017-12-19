import { Component, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseQuestionComponent } from './question.base.component';

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
        return value.join(',');
    }

}
