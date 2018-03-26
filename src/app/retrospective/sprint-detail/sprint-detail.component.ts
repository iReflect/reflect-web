import { Component, OnInit } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import {
    API_RESPONSE_MESSAGES,
    APP_ROUTE_URLS,
    DATE_FORMAT,
    SNACKBAR_DURATION,
    SPRINT_ACTIONS,
    SPRINT_ACTIONS_LABEL,
    SPRINT_STATES,
    SPRINT_STATES_LABEL,
    SPRINT_SYNC_STATES,
    ACTIONABLE_SPRINT_STATES
} from '../../../constants/app-constants';
import { BasicModalComponent } from '../../shared/basic-modal/basic-modal.component';
import { RetrospectiveService } from '../../shared/services/retrospective.service';
import { UtilsService } from '../../shared/utils/utils.service';

@Component({
    selector: 'app-sprint-detail',
    templateUrl: './sprint-detail.component.html',
    styleUrls: ['./sprint-detail.component.scss']
})
export class SprintDetailComponent implements OnInit {
    sprintDays: number;
    sprintStatus: number;
    selectedValue: number;
    sprintID: any;
    retrospectiveID: any;
    sprintDetails: any;
    selectedTabIndex = 0;
    enableRefresh = true;
    dateFormat = DATE_FORMAT;
    sprintStates = SPRINT_STATES;
    sprintStatesLabel = SPRINT_STATES_LABEL;
    sprintActions = SPRINT_ACTIONS;
    sprintActionsLabel = SPRINT_ACTIONS_LABEL;
    syncStates = SPRINT_SYNC_STATES;

    constructor(private retrospectiveService: RetrospectiveService,
                private snackBar: MatSnackBar,
                private router: Router,
                private activatedRoute: ActivatedRoute,
                private utils: UtilsService,
                public dialog: MatDialog) {
    }

    ngOnInit() {
        this.getSprintDetails();
    }

    getSprintDetails() {
        const params = this.activatedRoute.snapshot.params;
        this.retrospectiveID = params['retrospectiveID'];
        this.sprintID = params['sprintID'];
        this.retrospectiveService.getSprintDetails(this.retrospectiveID, this.sprintID).subscribe(
            response => {
                this.sprintDetails = response.data;
                this.sprintStatus = response.data.Status;
                this.selectedValue = ACTIONABLE_SPRINT_STATES[this.sprintStatus];
                this.sprintDays = this.utils.workdayCount(response.data.StartDate, response.data.EndDate);
                if (this.sprintDetails.SyncStatus === SPRINT_SYNC_STATES.SYNCING) {
                    setTimeout(() => this.getSprintDetails(), 5000);
                }
            },
            err => {
                this.snackBar.open(
                    this.utils.getApiErrorMessage(err) || API_RESPONSE_MESSAGES.getSprintDetailsError,
                    '', {duration: SNACKBAR_DURATION});
                this.navigateToRetrospectiveDashboard();
            }
        );
    }

    navigateToRetrospectiveDashboard() {
        this.router.navigateByUrl(APP_ROUTE_URLS.retrospectiveDashboard.replace(':retrospectiveID', this.retrospectiveID));
    }

    sprintStateChangeError(errorMessage) {
        if (errorMessage) {
            this.snackBar.open(errorMessage, '', {duration: SNACKBAR_DURATION});
        }
        this.selectedValue = undefined;
    }

    activateSprint() {
        const dialogRef = this.dialog.open(BasicModalComponent, {
            data: {
                content: 'Are you sure you want to Activate sprint?',
                confirmBtn: 'Yes',
                cancelBtn: 'Cancel'
            },
            disableClose: true
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.retrospectiveService.activateSprint(this.retrospectiveID, this.sprintID).subscribe(
                    () => {
                        this.sprintStatus = this.sprintStates.ACTIVE;
                        this.snackBar.open(
                            API_RESPONSE_MESSAGES.sprintActivated,
                            '', {duration: SNACKBAR_DURATION});
                    },
                    err => this.sprintStateChangeError(this.utils.getApiErrorMessage(err) || API_RESPONSE_MESSAGES.sprintActivateError)
                );
            }
        });
    }

    freezeSprint() {
        const dialogRef = this.dialog.open(BasicModalComponent, {
            data: {
                content: 'Are you sure you want to Freeze sprint?',
                confirmBtn: 'Yes',
                cancelBtn: 'Cancel'
            },
            disableClose: true
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.retrospectiveService.freezeSprint(this.retrospectiveID, this.sprintID).subscribe(
                    () => {
                        this.sprintStatus = this.sprintStates.FROZEN;
                        this.snackBar.open(
                            API_RESPONSE_MESSAGES.sprintFrozen,
                            '', {duration: SNACKBAR_DURATION});
                    },
                    err => this.sprintStateChangeError(
                        this.utils.getApiErrorMessage(err) || API_RESPONSE_MESSAGES.sprintFreezeError)
                );
            }
        });
    }

    discardSprint() {
        const dialogRef = this.dialog.open(BasicModalComponent, {
            data: {
                content: 'Are you sure you want to Activate sprint?',
                confirmBtn: 'Yes',
                cancelBtn: 'Cancel'
            },
            disableClose: true
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.retrospectiveService.discardSprint(this.retrospectiveID, this.sprintID).subscribe(
                    () => {
                        this.snackBar.open(
                            API_RESPONSE_MESSAGES.sprintDiscarded,
                            '', {duration: SNACKBAR_DURATION});
                        this.navigateToRetrospectiveDashboard();
                    },
                    err => this.sprintStateChangeError(
                        this.utils.getApiErrorMessage(err) || API_RESPONSE_MESSAGES.sprintDiscardError)
                );
            }
        });
    }

    refreshSprintDetails() {
        this.retrospectiveService.refreshSprintDetails(this.retrospectiveID, this.sprintID).subscribe(
            () => {
                this.sprintDetails.SyncStatus = SPRINT_SYNC_STATES.SYNCING;
                this.snackBar.open(
                    API_RESPONSE_MESSAGES.sprintComputationInitiated,
                    '', {duration: SNACKBAR_DURATION});
            },
            err => {
                this.snackBar.open(
                    this.utils.getApiErrorMessage(err) || API_RESPONSE_MESSAGES.refreshSprintError,
                    '', {duration: SNACKBAR_DURATION});
            }
        );
    }

    toggleAutoRefresh() {
        this.enableRefresh = !this.enableRefresh;
    }
}
