import { Component, Input, OnInit } from '@angular/core';
import { SprintListDataSource } from './sprint-list.data-source';
import { RetrospectiveService } from '../../shared/services/retrospective.service';
import { API_RESPONSE_MESSAGES, SPRINT_STATES_LABEL, APP_ROUTE_URLS, SNACKBAR_DURATION } from '../../../constants/app-constants';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-sprint-list',
  templateUrl: './sprint-list.component.html',
  styleUrls: ['./sprint-list.component.scss']
})
export class SprintListComponent implements OnInit {

    @Input() retrospectiveID: any;
    displayedSprintColumns = ['title', 'start_date', 'end_date', 'status', 'created_by', 'last_synced_at'];

    dataSource: SprintListDataSource;
    dateFormat = 'MMMM dd, yyyy';

    constructor(private retrospectiveService: RetrospectiveService,
                private snackBar: MatSnackBar,
                private router: Router) { }

    showCannotGetSprintsError() {
        this.snackBar.open(API_RESPONSE_MESSAGES.getSprintsError, '', {duration: SNACKBAR_DURATION});
    }

    initializeDataSource() {
        this.dataSource = new SprintListDataSource(
            this.retrospectiveService,
            this.retrospectiveID,
            this.showCannotGetSprintsError.bind(this)
        );
    }

    navigateToSprint(row) {
        this.router.navigateByUrl(
            APP_ROUTE_URLS.sprintDetails.replace(':retrospectiveID', this.retrospectiveID).replace(':sprintID', row.ID)
        );
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
