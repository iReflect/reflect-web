import { Component, OnInit } from '@angular/core';
import { HomeService } from './home.service';
import { Router } from '@angular/router';
import { APP_ROUTE_URLS } from '../../constants/app-constants';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  feedback_event_data: any = {};
  isDataLoaded = false;

  constructor(private homeService: HomeService, private router: Router) {
  }

  getFeedbackListData() {
    this.homeService.getFeedBackEventList().subscribe(data => {
      this.isDataLoaded = true;
      this.feedback_event_data = data;
    });
  }

  ngOnInit() {
    this.getFeedbackListData();
  }

  navigate(status) {
    this.router.navigate([APP_ROUTE_URLS.feedbackList], { queryParams: {'status': status}});
  }
}
