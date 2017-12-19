import { DataSource } from '@angular/cdk/collections';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { FeedbackListService } from './feedback-list.service';

export class FeedBackListDataSource extends DataSource<any> {
    statuses: any;
    private _dataChange: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

    constructor(private feedbackListService: FeedbackListService, private route: ActivatedRoute) {
        super();
    }

    get dataChange$() {
        return this._dataChange.asObservable();
    }

    connect(): Observable<any[]> {
        let queryParams;
        this.route.queryParams.subscribe((params) => queryParams = params);
        this.feedbackListService.getFeedBackList(queryParams).subscribe(
            eventData => {
                this._dataChange.next(eventData);
            });
        return this._dataChange.asObservable().map(data => data['Feedbacks']);
    }

    disconnect() {
    }
}
