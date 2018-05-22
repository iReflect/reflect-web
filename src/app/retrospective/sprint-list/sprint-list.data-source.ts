import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { RetrospectiveService } from '../../shared/services/retrospective.service';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/finally';

export class SprintListDataSource extends DataSource<any> {
    public dataChange: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
    private destroy$: Subject<boolean> = new Subject<boolean>();
    isSprintsLoading = false;
    allSprintsLoaded = false;
    lastSprintLoaded: any;

    constructor(
        private retrospectiveService: RetrospectiveService,
        private retrospectiveID: any,
        private rowsToLoad: number,
        private errorCallback: any
    ) {
        super();
    }

    connect(): Observable<any[]> {
        if (!this.allSprintsLoaded && !this.isSprintsLoading) {
            const query: any = { count: this.rowsToLoad };
            if (this.lastSprintLoaded) {
                query.after = encodeURIComponent(this.lastSprintLoaded.EndDate);
            }
            this.isSprintsLoading = true;
            this.retrospectiveService.listSprintsByRetrospectiveID(this.retrospectiveID, query)
                .takeUntil(this.destroy$)
                .finally(() => this.isSprintsLoading = false)
                .subscribe(
                response => {
                    const sprints = response.data.Sprints;
                    this.dataChange.next([...this.dataChange.value, ...sprints]);
                    this.lastSprintLoaded = this.dataChange.value[this.dataChange.value.length - 1];
                    if (sprints.length < this.rowsToLoad) {
                        this.allSprintsLoaded = true;
                    }
                },
                err => {
                    this.errorCallback(err);
                }
            );
        }
        return this.dataChange.asObservable();
    }

    disconnect() {
        this.destroy$.next(true);
        this.destroy$.complete();
    }
}
