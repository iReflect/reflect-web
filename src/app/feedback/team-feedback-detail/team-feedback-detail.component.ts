import { Component } from '@angular/core';
import { FeedbackService } from '../../shared/services/feedback.service';

@Component({
    selector: 'app-team-feedback-detail-page',
    templateUrl: './team-feedback-detail.component.html'
})
export class TeamFeedbackDetailComponent {

    constructor(private service: FeedbackService) {
    }
}
