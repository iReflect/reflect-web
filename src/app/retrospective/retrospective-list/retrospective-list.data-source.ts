import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { RetrospectiveService } from '../../shared/services/retrospective.service';

export class RetrospectiveListDataSource extends DataSource<any> {
    private dataChange: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
    private onFailureCallback: (_: any) => void = () => {};

    constructor(private service: RetrospectiveService,
                ) {
        super();
    }

    connect(): Observable<any> {
        this.service.getRetrospectives().subscribe(
            response => {
                this.dataChange.next(response.data.Retrospectives);
            },
            err => {
                console.log(err);
            }
        );
        return this.dataChange.asObservable();
    }

    disconnect() {
    }
}
