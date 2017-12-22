///<reference path="../../../../node_modules/@angular/core/src/metadata/directives.d.ts"/>
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ERRORS, FEEDBACK_STATES, QUESTION_TYPES } from '../../../constants/app-constants';
import { FeedbackService } from "../../shared/services/feedback.service";

@Component({
    selector: 'app-feedback-detail',
    templateUrl: './feedback-detail.component.html',
    styleUrls: ['./feedback-detail.component.scss']
})
export class FeedbackDetailComponent implements OnInit {

    isDataLoaded = false;
    dateFormat: 'MMMM dd, yyyy';
    multipleChoiceType = QUESTION_TYPES.MULTIPLE_CHOICE;
    gradeType = QUESTION_TYPES.GRADING;
    booleanType = QUESTION_TYPES.BOOLEAN;
    form: FormGroup;
    feedbackData: any;
    selectedNav: number;
    feedbackId;

    constructor(private feedBackService: FeedbackService, private activatedRoute: ActivatedRoute) {
    }

    getFeedBack() {
        this.activatedRoute.params.subscribe(
            params => {
                this.feedbackId = params['id'];
                this.feedBackService.getFeedBack(this.feedbackId).subscribe(
                    response => {
                        let data = response.data;
                        this.feedbackData = data;
                        let categoryIDList = Object.keys(data['Categories']);
                        this.selectedNav = parseInt(categoryIDList.length > 0 ? categoryIDList[0] : '0', 10);
                        this.isDataLoaded = true;
                        this.form = this.feedBackService.toFormGroup(data['Categories'],
                            data['Status'] ? data['Status'] === FEEDBACK_STATES.SUBMITTED : false);
                    }
                );
            }
        );
    }

    ngOnInit() {
        this.getFeedBack();
    }

    showHideNav(categoryID) {
        this.selectedNav = categoryID;
    }

    getRequiredErrorMessage(questionControl: FormControl) {
        if (questionControl.touched && questionControl.errors && questionControl.errors.required) {
            return ERRORS.questionResponseRequired;
        }
    }

    onSubmit(saveAndSubmit = false) {
        let status = this.feedbackData['Status'];
        if (saveAndSubmit) {
            status = FEEDBACK_STATES.SUBMITTED;
        }
        this.feedBackService.submitData(this.feedbackId, {
            'data': this.form.value, 'saveAndSubmit': saveAndSubmit,
            'status': status
        });
    }
}
