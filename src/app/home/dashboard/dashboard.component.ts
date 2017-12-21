import { Component, OnInit } from '@angular/core';
import {HomeService} from '../home.service';
import {Router} from '@angular/router';
import {APP_ROUTE_URLS, FEEDBACK_STATES} from '../../../constants/app-constants';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

    feedbackDetailURL: string = APP_ROUTE_URLS.feedback;
    newFeedbackFilters: any = {'status': FEEDBACK_STATES.NEW, 'perPage': 5};
    inProgressFeedbackFilters: any = {'status': FEEDBACK_STATES.IN_PROGRESS, 'perPage': 5};
    submittedFeedbackFilters: any = {'status': FEEDBACK_STATES.SUBMITTED, 'perPage': 5};

    newFeedbackCount: number;
    draftFeedbackCount: number;
    submittedFeedbackCount: number;


    constructor(private service: HomeService, private router: Router) {
    }

    setNewFeedbackCount (count) {
        this.newFeedbackCount = count;
    }
    setDraftFeedbackCount (count) {
        this.draftFeedbackCount = count;
    }
    setSubmittedFeedbackCount (count) {
        this.submittedFeedbackCount = count;
    }

    ngOnInit() {
    }
}
