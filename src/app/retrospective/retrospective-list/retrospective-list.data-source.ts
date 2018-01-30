import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { RetrospectiveService } from '../../shared/services/retrospective.service';

export class RetrospectiveListDataSource extends DataSource<any> {
    private dataChange: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);


    constructor(private service: RetrospectiveService) {
        super();
    }

    connect(): Observable<any[]> {
        let restroSpectiveListData = this.service.getRetrospectives();
        this.dataChange.next(restroSpectiveListData['retrospectives']);
        return this.dataChange.asObservable();
    }

    disconnect() {
    }
}
