import { Component } from '@angular/core';
import { TeamFeedbackService } from 'app/shared/services/team-feedback.service';
import { APP_ROUTE_URLS } from '@constants/app-constants';

@Component({
    selector: 'app-team-feedback-detail-page',
    templateUrl: './team-feedback-detail.component.html'
})
export class TeamFeedbackDetailComponent {
    feedbackListURL: string;

    constructor(public service: TeamFeedbackService) {
        this.feedbackListURL = APP_ROUTE_URLS.teamFeedbackList;
    }
}
