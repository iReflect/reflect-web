import { Component } from '@angular/core';
import { FeedbackService } from '../../shared/services/feedback.service';
import { APP_ROUTE_URLS } from '../../../constants/app-constants';

@Component({
    selector: 'app-feedback',
    templateUrl: './my-feedback-list.component.html',
})
export class MyFeedbackListComponent {

    feedbackDetailURL: string;

    constructor(private service: FeedbackService) {
        this.feedbackDetailURL = APP_ROUTE_URLS.feedback;
    }
}
