import { Component } from '@angular/core';
import { FeedbackService } from '../../shared/services/feedback.service';

@Component({
    selector: 'app-feedback-detail-page',
    templateUrl: './my-feedback-detail.component.html'
})
export class MyFeedbackDetailComponent {

    constructor(private service: FeedbackService) {
    }
}
