import { Component } from '@angular/core';
import { TeamFeedbackService } from "../../shared/services/team-feedback.service";

@Component({
    selector: 'app-team-feedback-detail-page',
    templateUrl: './team-feedback-detail.component.html'
})
export class TeamFeedbackDetailComponent {

    constructor(public service: TeamFeedbackService) {
    }
}
