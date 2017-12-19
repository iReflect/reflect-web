///<reference path="../../../../node_modules/@angular/core/src/metadata/directives.d.ts"/>
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
    ERRORS, QUESTION_TYPES
} from '../../../constants/app-constants';
import { FeedbackDetailService } from './feedback-detail.service';

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

    constructor(private feedBackService: FeedbackDetailService, private activatedRoute: ActivatedRoute) {
    }

    getFeedBack() {
        this.activatedRoute.params.subscribe(
            params => {
                this.feedbackId = params['id'];
                this.feedBackService.getFeedBack(this.feedbackId).subscribe(
                    data => {
                        this.feedbackData = data;
                        let categoryIDList = Object.keys(data['Categories']);
                        this.selectedNav = parseInt(categoryIDList.length > 0 ? categoryIDList[0] : '0', 10);
                        this.isDataLoaded = true;
                        this.form = this.feedBackService.toFormGroup(data['Categories']);
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

    onSubmit(saveAsDraft = false) {
        this.feedBackService.postData(this.feedbackId, {'data': this.form.value, 'saveAsDraft': saveAsDraft});
    }
}
