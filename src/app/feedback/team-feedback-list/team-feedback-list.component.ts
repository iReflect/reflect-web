import { Component } from '@angular/core';
import { APP_ROUTE_URLS } from '../../../constants/app-constants';
import { TeamFeedbackService } from '../../shared/services/team-feedback.service';

@Component({
    selector: 'app-team-feedback',
    templateUrl: './team-feedback-list.component.html',
})
export class TeamFeedbackListComponent {

    feedbackDetailURL: string;

    constructor(public service: TeamFeedbackService) {
        this.feedbackDetailURL = APP_ROUTE_URLS.teamFeedback;
    }
}
