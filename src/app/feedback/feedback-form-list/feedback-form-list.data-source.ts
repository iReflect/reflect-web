import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { FeedbackFormListService } from './feedback-form-list.service';

export class FeedBackListDataSource extends DataSource<any> {
  private _dataChange: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  filters: any;
  constructor(private feedbackFormListService: FeedbackFormListService) {
    super();
  }

  setFilters(filters: any) {
    this.filters = filters;
  }

  connect (): Observable<any[]> {
    this.feedbackFormListService.getFeedBackEventList(this.filters).subscribe(
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
