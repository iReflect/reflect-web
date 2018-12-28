import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { COMMENT_TOOLTIP_MAP, QUESTION_TYPES } from '@constants/app-constants';

@Component({
    selector: 'app-question-response',
    templateUrl: './question-response.component.html',
    styleUrls: ['./question-response.component.scss']
})
export class QuestionResponseComponent implements OnInit {

    @Input() question: any;
    @Input() questionNo: number;
    @Input() form: FormGroup;
    multipleChoiceType = QUESTION_TYPES.MULTIPLE_CHOICE;
    gradeType = QUESTION_TYPES.GRADING;
    booleanType = QUESTION_TYPES.BOOLEAN;
    showComment = false;
    commentControl: AbstractControl;

    constructor() {
    }

    initializeCommentControl() {
        this.commentControl = this.form.controls['comment'];
    }

    getCommentToolTipText() {
        return this.showComment ? COMMENT_TOOLTIP_MAP.hideComment
            : (this.commentControl.disabled ? COMMENT_TOOLTIP_MAP.viewComment
                : (this.commentControl.value ? COMMENT_TOOLTIP_MAP.editComment : COMMENT_TOOLTIP_MAP.addComment));
    }

    ngOnInit() {
        this.initializeCommentControl();
    }

    toggleComment() {
        this.showComment = !this.showComment;
    }
}
