import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { RetrospectiveService } from '../../shared/services/retrospective.service';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';

export class SprintListDataSource extends DataSource<any> {
    public dataChange: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
    private destroy$: Subject<boolean> = new Subject<boolean>();

    constructor(
        private retrospectiveService: RetrospectiveService,
        private retrospectiveID: any,
        private errorCallback: any
    ) {
        super();
    }

    connect(): Observable<any[]> {
        this.retrospectiveService.listSprintsByRetrospectiveID(this.retrospectiveID)
            .takeUntil(this.destroy$)
            .subscribe(
                response => {
                    this.dataChange.next(response.data.Sprints);
                },
                err => {
                    this.errorCallback(err);
                }
            );
        return this.dataChange.asObservable();
    }

    disconnect() {
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
    }
}
