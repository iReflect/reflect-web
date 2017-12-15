import { Component, OnInit } from '@angular/core';
import { FeedBackListDataSource } from './feedback-form-list.data-source';
import {
  APP_ROUTE_URLS,
  FEEDBACK_EVENT_STATES, IN_PROGRESS_EVENT, NEW_EVENT,
} from '../../../constants/app-constants';
import { ActivatedRoute, Router} from '@angular/router';
import { FeedbackFormListService } from './feedback-form-list.service';

@Component({
  selector: 'app-feedback-form-list',
  templateUrl: './feedback-form-list.component.html',
  styleUrls: ['./feedback-form-list.component.scss']
})
export class FeedbackFormListComponent implements OnInit {

  isListLoaded = false;
  showFilters = false;
  dataSource: FeedBackListDataSource;
  displayedColumns = ['title', 'user', 'user_role', 'duration_start', 'duration_end', 'expiry_date', 'status'];
  filters = {'status': []};
  defaultStatusFilters = [NEW_EVENT, IN_PROGRESS_EVENT];
  statusChoices;

  constructor(private router: Router, private feedbackFormListService: FeedbackFormListService,
              private route: ActivatedRoute) {
    this.statusChoices = [];
    Object.keys(FEEDBACK_EVENT_STATES).forEach(key =>
      this.statusChoices.push({value: key, label: FEEDBACK_EVENT_STATES[key]}))
    }

  initializeDataSource () {
    this.dataSource = new FeedBackListDataSource(this.feedbackFormListService, this.route);
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
      { queryParams: this.filters});
  }

  ngOnInit() {
    this.initializeDataSource();
  }

  navigateToFeedBackForm (row) {
    this.router.navigateByUrl(APP_ROUTE_URLS.feedback.replace(':id', row.ID));
  }

  parse_to_date (value) {
    if (!value) { return ''; }
    return new Date(value).toDateString();
  }

  getStatusValue(status) {
    return FEEDBACK_EVENT_STATES[parseInt(status, 10)];
  }

  getUser(profile) {
    return (profile && profile.User) ? (profile.User.FirstName + ' ' + profile.User.LastName).trim() : '';
  }

  getUserRole(profile) {
    return (profile && profile.Role) ? profile.Role.Name : '';
  }

}
