import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FeedBackListDataSource } from '../../feedback/feedback-list/feedback-list.data-source';
import { FeedbackService } from '../../shared/services/feedback.service';
import { APP_ROUTE_URLS, FEEDBACK_STATES } from '../../../constants/app-constants';

@Component({
    selector: 'app-dashboard-feedback-list',
    templateUrl: './dashboard-feedback-list.component.html',
    styleUrls: ['./dashboard-feedback-list.component.scss']
})
export class DashboardFeedbackListComponent implements OnInit {

    @Input()
    service: FeedbackService;

    @Input()
    feedbackDetailURL: string;

    @Input()
    filters: any;

    @Input()
    title: string;

    @Input()
    listType: number;

    feedbackCount: number;

    isListLoaded = false;
    displayedColumns = ['title', 'user', 'userRole', 'startDate', 'endDate'];

    // TODO: using feedback's data source for now, either create a separate data source or move it to shared.
    dataSource: FeedBackListDataSource;
    dateFormat = 'MMMM dd, yyyy';

    constructor(private router: Router) {
    }

    ngOnInit() {
        this.dataSource = new FeedBackListDataSource(this.service);
        const appliedFilters = Object.assign({}, this.filters);
        this.dataSource.setFilters(appliedFilters);
        this.dataSource.connect();
        this.dataSource.dataChange$.subscribe(data => {
            this.isListLoaded = true;
            if (this.listType === FEEDBACK_STATES.NEW) {
                this.feedbackCount = this.dataSource.newFeedbackCount;
            } else if (this.listType === FEEDBACK_STATES.IN_PROGRESS) {
                this.feedbackCount = this.dataSource.draftFeedbackCount;
            } else if (this.listType === FEEDBACK_STATES.SUBMITTED) {
                this.feedbackCount = this.dataSource.submittedFeedbackCount;
            }
        });
    }

    navigateToList() {
        this.router.navigate([APP_ROUTE_URLS.feedbackList], {queryParams: {'status': this.listType}});
    }

    navigateToFeedBack(row) {
        this.router.navigateByUrl(this.feedbackDetailURL.replace(':id', row.ID));
    }

    getUser(profile) {
        return (profile && profile.User) ? (profile.User.FirstName + ' ' + profile.User.LastName).trim() : '';
    }

    getUserRole(profile) {
        return (profile && profile.Role) ? profile.Role.Name : '';
    }
}
