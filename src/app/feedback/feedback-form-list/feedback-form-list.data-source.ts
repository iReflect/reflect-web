import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { FeedbackFormListService } from './feedback-form-list.service';
import { ActivatedRoute } from '@angular/router';

export class FeedBackListDataSource extends DataSource<any> {
  private _dataChange: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  statuses: any;
  constructor(private feedbackFormListService: FeedbackFormListService, private route: ActivatedRoute) {
    super();
  }
  connect (): Observable<any[]> {
    let queryParams;
    this.route.queryParams.subscribe((params) => queryParams = params);
    this.feedbackFormListService.getFeedBackEventList(queryParams).subscribe(
      event_data => {
        this._dataChange.next(event_data);
      });
    return this._dataChange.asObservable().map(data => data['Feedbacks']);
  }
  disconnect() {}

  get dataChange$() {
    return this._dataChange.asObservable();
  }
}
