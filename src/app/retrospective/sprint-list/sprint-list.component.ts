import { Component, Input, OnInit } from '@angular/core';
import { SprintListDataSource } from './sprint-list.data-source';
import { RetrospectiveService } from '../../shared/services/retrospective.service';
import { SPRINT_STATES_LABEL } from '../../../constants/app-constants';

@Component({
  selector: 'app-sprint-list',
  templateUrl: './sprint-list.component.html',
  styleUrls: ['./sprint-list.component.scss']
})
export class SprintListComponent implements OnInit {

    @Input() retroSpectiveData: any;
    displayedSprintColumns = ['title', 'start_date', 'end_date', 'total_time_spent', 'status', 'created_by', 'last_synced_at'];

    dataSource: SprintListDataSource;
    dateFormat = 'MMMM dd, yyyy';

    constructor(private service: RetrospectiveService) { }

    initializeDataSource() {
        this.dataSource = new SprintListDataSource(this.retroSpectiveData.ID, this.service);
    }

    navigateToSprint(row) {
        // Redirect to sprint dashboard
        alert('Redirecting to Sprint Dashboard');
    }

    ngOnInit() {
        this.initializeDataSource();
    }

    getUserName(user: any) {
        return user.FirstName + ' ' + user.LastName;
    }

    getStatusValue(status) {
        return SPRINT_STATES_LABEL[status];
    }
}
