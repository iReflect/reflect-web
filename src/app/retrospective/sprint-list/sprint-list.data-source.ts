import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { RetrospectiveService } from '../../shared/services/retrospective.service';

export class SprintListDataSource extends DataSource<any> {
    private dataChange: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

    constructor(private retroSpectiveID: any, private service: RetrospectiveService) {
        super();
    }

    connect(): Observable<any[]> {
        this.service.listSprintByRetrospectiveID(this.retroSpectiveID).subscribe(sprintListData => {
            this.dataChange.next(sprintListData['Sprints']);
        });
        return this.dataChange.asObservable();
    }

    disconnect() {
    }
}
