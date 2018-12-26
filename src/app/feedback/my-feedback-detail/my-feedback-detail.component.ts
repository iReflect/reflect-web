import { Component } from '@angular/core';
import { FeedbackService } from 'app/shared/services/feedback.service';
import { APP_ROUTE_URLS } from '@constants/app-constants';

@Component({
    selector: 'app-feedback-detail-page',
    templateUrl: './my-feedback-detail.component.html'
})
export class MyFeedbackDetailComponent {

    feedbackListURL: string;

    constructor(public service: FeedbackService) {
        this.feedbackListURL = APP_ROUTE_URLS.feedbackList;
    }
}
