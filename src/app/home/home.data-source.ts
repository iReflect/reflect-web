import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { HomeService } from './home.service';

export class FeedBackEventDataSource extends DataSource<any> {
  private _dataChange: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  statuses: any;
  constructor(private homeService: HomeService) {
    super();
  }
  connect (): Observable<any[]> {
    this.homeService.getFeedBackEventList(this.statuses).subscribe(
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
