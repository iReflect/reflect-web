import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { RetrospectiveService } from '../../shared/services/retrospective.service';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';

export class RetrospectiveListDataSource extends DataSource<any> {
    private dataChange: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
    private destroy$: Subject<boolean> = new Subject<boolean>();

    constructor(
        private retrospectiveService: RetrospectiveService,
        private errorCallback: any
    ) {
        super();
    }

    connect(): Observable<any> {
        this.retrospectiveService.getRetrospectives()
            .takeUntil(this.destroy$)
            .subscribe(
                response => {
                    this.dataChange.next(response.data.Retrospectives);
                },
                err => {
                    this.errorCallback(err);
                }
            );
        return this.dataChange.asObservable();
    }

    disconnect() {
        this.destroy$.next(true);
        this.destroy$.complete();
    }
}
