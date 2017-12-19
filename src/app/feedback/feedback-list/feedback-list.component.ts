import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { APP_ROUTE_URLS, FEEDBACK_STATES_LABEL } from '../../../constants/app-constants';
import { FeedBackListDataSource } from './feedback-list.data-source';
import { FeedbackListService } from './feedback-list.service';

@Component({
    selector: 'app-feedback-list',
    templateUrl: './feedback-list.component.html',
    styleUrls: ['./feedback-list.component.scss']
})
export class FeedbackListComponent implements OnInit {

    isListLoaded = false;
    showFilters = false;
    dataSource: FeedBackListDataSource;
    displayedColumns = ['title', 'user', 'user_role', 'duration_start', 'duration_end', 'expiry_date', 'status'];
    filters = {'status': []};
    statusChoices;

    constructor(private router: Router, private feedbackListService: FeedbackListService,
                private route: ActivatedRoute) {
        this.statusChoices = [];
        Object.keys(FEEDBACK_STATES_LABEL).forEach(key =>
            this.statusChoices.push({value: key, lablel: FEEDBACK_STATES_LABEL[key]}))
    }

    initializeDataSource() {
        this.dataSource = new FeedBackListDataSource(this.feedbackListService, this.route);
        let queryParams;
        this.route.queryParams.subscribe((params) => {
            queryParams = params;
            this.filters.status = queryParams.status ? (typeof queryParams.status === 'object' ? queryParams.status : [queryParams.status]) : [];
            this.dataSource.connect();
        });
        this.dataSource.dataChange$.subscribe(data => {
            this.isListLoaded = true;
        });
    }

    filterList() {
        this.router.navigate([APP_ROUTE_URLS.feedbackList],
            {queryParams: this.filters});
    }

    ngOnInit() {
        this.initializeDataSource();
    }

    navigateToFeedBack(row) {
        this.router.navigateByUrl(APP_ROUTE_URLS.feedback.replace(':id', row.ID));
    }

    parseToDate(value) {
        if (!value) {
            return '';
        }
        return new Date(value).toDateString();
    }

    getStatusValue(status) {
        return FEEDBACK_STATES_LABEL[status];
    }

    getUser(profile) {
        return (profile && profile.User) ? (profile.User.FirstName + ' ' + profile.User.LastName).trim() : '';
    }

    getUserRole(profile) {
        return (profile && profile.Role) ? profile.Role.Name : '';
    }

}
