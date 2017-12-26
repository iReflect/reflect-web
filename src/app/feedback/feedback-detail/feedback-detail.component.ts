import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { API_RESPONSE_MESSAGES, FEEDBACK_STATES } from '../../../constants/app-constants';
import { FeedbackService } from "../../shared/services/feedback.service";
import { TeamFeedbackService } from "../../shared/services/team-feedback.service";

@Component({
    selector: 'app-feedback-detail',
    templateUrl: './feedback-detail.component.html',
    styleUrls: ['./feedback-detail.component.scss']
})
export class FeedbackDetailComponent implements OnInit {

    @Input()
    service: FeedbackService | TeamFeedbackService;

    @Input()
    showControls = false;

    form: FormGroup;
    feedbackData: any;
    feedbackId: number;
    isFormSubmitted = false;
    submittedState: number;
    submittedAt: string;
    isDataLoaded = false;
    dateFormat = 'MMMM dd, yyyy';
    snackBarDuration = 2000; // in ms

    constructor(private activatedRoute: ActivatedRoute, private snackBar: MatSnackBar) {
    }

    getFeedBack() {
        this.submittedState = FEEDBACK_STATES.SUBMITTED;
        this.activatedRoute.params.subscribe(
            params => {
                this.feedbackId = params['id'];
                this.service.getFeedBack(this.feedbackId).subscribe(
                    response => {
                        let data = response.data;
                        this.feedbackData = data;
                        this.submittedAt = data['SubmittedAt'];
                        this.isDataLoaded = true;
                        this.isFormSubmitted = data['Status'] ? data['Status'] === this.submittedState : false;
                        this.form = this.service.toFormGroup(data['Categories'], this.isFormSubmitted && this.showControls);
                    }
                );
            }
        );
    }

    ngOnInit() {
        this.getFeedBack();
    }

    onSubmit(saveAndSubmit = false) {
        if (!this.showControls) {
            return;
        }
        let status = this.feedbackData['Status'], submittedAt;
        if (saveAndSubmit) {
            status = FEEDBACK_STATES.SUBMITTED;
            submittedAt = new Date().toISOString();
        }
        this.service.submitData(this.feedbackId, {
            data: this.form.value, saveAndSubmit: saveAndSubmit,
            status: status, submittedAt: submittedAt
        }).subscribe(
            (response) => {
                this.isFormSubmitted = status === FEEDBACK_STATES.SUBMITTED;
                this.snackBar.open(
                    this.isFormSubmitted ? API_RESPONSE_MESSAGES.feedBackSubmitted : API_RESPONSE_MESSAGES.feedBackSaved,
                    '',
                    {duration: this.snackBarDuration}
                );
                if (this.isFormSubmitted) {
                    this.submittedAt = submittedAt;
                    this.form.disable();
                }
            },
            (error) => {
                this.snackBar.open(error.data.message || API_RESPONSE_MESSAGES.error, '', {duration: this.snackBarDuration});
            }
        );
    }
}
