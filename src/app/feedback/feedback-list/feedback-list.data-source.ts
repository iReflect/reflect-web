import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { FeedbackService } from '../../shared/services/feedback.service';
import { TeamFeedbackService } from '../../shared/services/team-feedback.service';

export class FeedBackListDataSource extends DataSource<any> {
    filters: any;
    public newFeedbackCount: number;
    public draftFeedbackCount: number;
    public submittedFeedbackCount: number;
    private dataChange: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

    constructor(private service: FeedbackService | TeamFeedbackService) {
        super();
    }

    get dataChange$() {
        return this.dataChange.asObservable();
    }

    setFilters(filters: any) {
        this.filters = filters;
    }

    connect(): Observable<any[]> {
        this.service.getFeedBacks(this.filters).subscribe(
            response => {
                this.dataChange.next(response.data);
            });
        return this.dataChange.asObservable().map(data => {
            this.newFeedbackCount = data['NewFeedbackCount'];
            this.draftFeedbackCount = data['DraftFeedbackCount'];
            this.submittedFeedbackCount = data['SubmittedFeedbackCount'];
            return data['Feedbacks'];
        });
    }

    disconnect() {
    }
}
