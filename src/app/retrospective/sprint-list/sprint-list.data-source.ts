import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { RetrospectiveService } from '../../shared/services/retrospective.service';

export class SprintListDataSource extends DataSource<any> {
    private dataChange: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

    constructor(private retrospectiveService: RetrospectiveService,
                private retrospectiveID: any,
                private errorCallback: any) {
        super();
    }

    connect(): Observable<any[]> {
        this.retrospectiveService.listSprintsByRetrospectiveID(this.retrospectiveID).subscribe(
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
    }
}
