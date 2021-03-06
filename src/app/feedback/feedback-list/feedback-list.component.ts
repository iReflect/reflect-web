import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';
import { FEEDBACK_STATES, FEEDBACK_STATES_LABEL } from '@constants/app-constants';
import { FeedbackService } from 'app/shared/services/feedback.service';
import { TeamFeedbackService } from 'app/shared/services/team-feedback.service';
import { UrlHelperService } from 'app/shared/utils/url-helper.service';
import { FeedBackListDataSource } from 'app/feedback/feedback-list/feedback-list.data-source';

@Component({
    selector: 'app-feedback-list',
    templateUrl: './feedback-list.component.html',
    styleUrls: ['./feedback-list.component.scss']
})
export class FeedbackListComponent implements OnInit {

    @Input()
    service: FeedbackService | TeamFeedbackService;

    @Input()
    title: string;

    @Input()
    feedbackDetailURL: string;

    isListLoaded = false;
    dataSource: FeedBackListDataSource;
    displayedColumns = ['title', 'user', 'user_role', 'team', 'duration_start', 'duration_end', 'expiry_date', 'status'];
    filters = {'status': []};
    defaultStatusFilters = [FEEDBACK_STATES.NEW, FEEDBACK_STATES.IN_PROGRESS];
    statusChoices;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private urlHelperService: UrlHelperService
    ) {
        this.statusChoices = [];
        Object.keys(FEEDBACK_STATES_LABEL).forEach(key =>
            this.statusChoices.push({value: key, label: FEEDBACK_STATES_LABEL[key]}));
    }

    initializeDataSource() {
        this.dataSource = new FeedBackListDataSource(this.service);
        const queryParams = this.route.snapshot.queryParams;
        this.filters.status = queryParams.status ? (typeof queryParams.status === 'object' ?
            queryParams.status : [queryParams.status]) : [];
        if (_.isEmpty(this.filters.status)) {
            this.filters.status = this.defaultStatusFilters.map(value => value.toString());
        }
        this.filterList();
        this.dataSource.dataChange$.subscribe(data => {
            this.isListLoaded = true;
        });
    }

    filterList() {
        const appliedFilters = Object.assign({}, this.filters);
        if (this.filters.status.length === this.statusChoices.length) {
            delete appliedFilters.status;
        }
        this.urlHelperService.updateQueryParams(appliedFilters);
        this.dataSource.setFilters(appliedFilters);
        this.dataSource.connect();
    }

    ngOnInit() {
        this.initializeDataSource();
    }

    navigateToFeedBack(row) {
        this.router.navigateByUrl(this.feedbackDetailURL.replace(':id', row.ID));
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

    getTeam(team) {
        return team ? team.Name : '';
    }

}
