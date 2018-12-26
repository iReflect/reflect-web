import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { API_RESPONSE_MESSAGES, DATE_FORMAT, FEEDBACK_STATES, SNACKBAR_DURATION } from '@constants/app-constants';
import { FeedbackService } from 'app/shared/services/feedback.service';
import { TeamFeedbackService } from 'app/shared/services/team-feedback.service';
import { UtilsService } from 'app/shared/utils/utils.service';

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

    @Input()
    feedbackListURL: string;

    form: FormGroup;
    feedbackData: any;
    feedbackId: number;
    isFormSubmitted = false;
    submittedState: number;
    submittedAt: string;
    isDataLoaded = false;
    dateFormat = DATE_FORMAT;

    constructor(private activatedRoute: ActivatedRoute,
                private snackBar: MatSnackBar,
                private utils: UtilsService,
                private router: Router) {
    }

    getFeedBack() {
        this.submittedState = FEEDBACK_STATES.SUBMITTED;
        this.activatedRoute.params.subscribe(
            params => {
                this.feedbackId = params['id'];
                this.service.getFeedBack(this.feedbackId).subscribe(
                    response => {
                        const data = response.data;
                        this.feedbackData = data;
                        this.submittedAt = data['SubmittedAt'];
                        this.isDataLoaded = true;
                        this.isFormSubmitted = data['Status'] ? data['Status'] === this.submittedState : false;
                        this.form = this.service.toFormGroup(data['Categories'], this.isFormSubmitted && this.showControls);
                    },
                    err => {
                        this.snackBar.open(
                            this.utils.getApiErrorMessage(err) || API_RESPONSE_MESSAGES.error,
                            '', {duration: SNACKBAR_DURATION})
                            .afterDismissed().subscribe(() => {
                            this.router.navigateByUrl(this.feedbackListURL);
                        });
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
            response => {
                this.isFormSubmitted = status === FEEDBACK_STATES.SUBMITTED;
                this.snackBar.open(
                    this.isFormSubmitted ? API_RESPONSE_MESSAGES.feedBackSubmitted : API_RESPONSE_MESSAGES.feedBackSaved,
                    '', {duration: SNACKBAR_DURATION});
                if (this.isFormSubmitted) {
                    this.submittedAt = submittedAt;
                    this.form.disable();
                }
            },
            err => {
                this.snackBar.open(
                    this.utils.getApiErrorMessage(err) || API_RESPONSE_MESSAGES.error,
                    '', {duration: SNACKBAR_DURATION});
            }
        );
    }
}
