import { Component, OnInit } from '@angular/core';
import { ApiService } from '../core/api/api.service';
import { FEEDBACK_EVENT_STATES, SUBMITTED_EVENT, NEW_EVENT, IN_PROGRESS_EVENT } from '../../constants/app-constants';
import { HomeService } from './home.service';
import { FeedBackEventDataSource } from './home.data-source';
import {Router} from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  feedback_event_data: any = {};
  isListLoaded = false;
  tabTypeList = [
    {
      tabLabelText: 'Processing',
      feedback_event_list_type: [IN_PROGRESS_EVENT, NEW_EVENT]
    },
    {
      tabLabelText: 'Submitted',
      feedback_event_list_type: [SUBMITTED_EVENT]
    }
  ];
  dataSource = new FeedBackEventDataSource(this.homeService);
  displayedColumns = ['title', 'user', 'user_role', 'duration_start', 'duration_end', 'expiry_date', 'status'];

  constructor(private router: Router, private homeService: HomeService) {
    this.dataSource.statuses = this.tabTypeList[0].feedback_event_list_type;
  }

  ngOnInit() {
    this.dataSource.dataChange$.subscribe(data => {
        this.isListLoaded = true;
        this.feedback_event_data = data;
    });
  }

  selectedTabChanged($event) {
    this.dataSource.statuses = this.tabTypeList.filter((value, index) => {
      if (value && value.tabLabelText === $event.tab.textLabel) {
        return true;
      }
    }).map(data => data.feedback_event_list_type)[0];
    this.dataSource.connect();
  }

  navigateToFeedBackForm (row) {
    this.router.navigateByUrl('/feedbacks/' + row.ID + '');
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
