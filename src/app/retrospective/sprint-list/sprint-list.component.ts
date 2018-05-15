import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';

import {
    API_RESPONSE_MESSAGES, SPRINT_STATES_LABEL, APP_ROUTE_URLS, SNACKBAR_DURATION,
    DATE_FORMAT
} from '../../../constants/app-constants';
import { SprintListDataSource } from './sprint-list.data-source';
import { RetrospectiveService } from '../../shared/services/retrospective.service';
import { UtilsService } from '../../shared/utils/utils.service';

@Component({
    selector: 'app-sprint-list',
    templateUrl: './sprint-list.component.html',
    styleUrls: ['./sprint-list.component.scss']
})
export class SprintListComponent implements OnInit, OnDestroy {
    dataSource: SprintListDataSource;

    displayedSprintColumns = ['title', 'start_date', 'end_date', 'status', 'created_by', 'last_synced_at'];
    sprintStates = SPRINT_STATES_LABEL;
    dateFormat = DATE_FORMAT;

    @Input() retrospectiveID: any;

    constructor(
        private retrospectiveService: RetrospectiveService,
        private snackBar: MatSnackBar,
        private router: Router,
        private utils: UtilsService,
        private changeDetectorRefs: ChangeDetectorRef
    ) {
    }

    ngOnInit() {
        this.initializeDataSource();
    }

    ngOnDestroy() {
        this.dataSource = null;
    }

    refresh() {
        this.initializeDataSource();
        this.changeDetectorRefs.detectChanges();
    }

    showCannotGetSprintsError(err) {
        this.snackBar.open(this.utils.getApiErrorMessage(err) || API_RESPONSE_MESSAGES.getSprintsError, '', {duration: SNACKBAR_DURATION});
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
}
