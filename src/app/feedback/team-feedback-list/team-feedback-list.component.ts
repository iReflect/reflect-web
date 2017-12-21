import { Component, OnInit } from '@angular/core';
import { APP_ROUTE_URLS } from '../../../constants/app-constants';
import { FeedbackService } from "../../shared/services/feedback.service";

@Component({
    selector: 'app-team-feedback',
    templateUrl: './team-feedback-list.component.html',
})
export class TeamFeedbackListComponent {

    feedbackDetailURL: string;

    constructor(private service: FeedbackService) {
        this.feedbackDetailURL = APP_ROUTE_URLS.teamFeedback;
    }
}
