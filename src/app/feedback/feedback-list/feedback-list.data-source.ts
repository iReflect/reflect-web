import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { FeedbackService } from "../../shared/services/feedback.service";

export class FeedBackListDataSource extends DataSource<any> {
    filters: any;
    private dataChange: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

    public newFeedbackCount: number;
    public draftFeedbackCount: number;
    public submittedFeedbackCount: number;

    constructor(private feedbackService: FeedbackService) {
        super();
    }

    setFilters(filters: any) {
        this.filters = filters;
    }

    get dataChange$() {
        return this.dataChange.asObservable();
    }

    connect (): Observable<any[]> {
        this.feedbackService.getFeedBacks(this.filters).subscribe(
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
