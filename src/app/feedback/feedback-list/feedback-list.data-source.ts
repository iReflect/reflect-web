import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { FeedbackListService } from './feedback-list.service';

export class FeedBackListDataSource extends DataSource<any> {
    filters: any;
    private _dataChange: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

    constructor(private feedbackListService: FeedbackListService) {
        super();
    }

    setFilters(filters: any) {
        this.filters = filters;
    }

    get dataChange$() {
        return this._dataChange.asObservable();
    }

    connect (): Observable<any[]> {
        this.feedbackListService.getFeedBackList(this.filters).subscribe(
            event_data => {
                this._dataChange.next(event_data);
            });
        return this._dataChange.asObservable().map(data => data['Feedbacks']);
    }

    disconnect() {
    }
}
