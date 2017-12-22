import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { APP_ROUTE_URLS } from '../../constants/app-constants';
import { FeedbackService } from "../shared/services/feedback.service";

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

    feedbackData: any = {};
    isDataLoaded = false;

    constructor(private feedbackService: FeedbackService, private router: Router) {
    }

    getFeedbacks() {
        this.feedbackService.getFeedBacks().subscribe(response => {
            this.isDataLoaded = true;
            this.feedbackData = response.data;
        });
    }

    ngOnInit() {
        this.getFeedbacks();
    }

    navigate(status) {
        this.router.navigate([APP_ROUTE_URLS.feedbackList], {queryParams: {'status': status}});
    }
}
