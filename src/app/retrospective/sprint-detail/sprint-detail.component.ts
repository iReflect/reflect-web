import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import {
    ACTIONABLE_SPRINT_STATES,
    API_RESPONSE_MESSAGES,
    APP_ROUTE_URLS,
    AUTO_REFRESH_DURATION,
    DATE_FORMAT,
    RESYNC_REFRESH_DURATION,
    SNACKBAR_DURATION,
    SPRINT_ACTIONS,
    SPRINT_ACTIONS_LABEL,
    SPRINT_STATES,
    SPRINT_STATES_LABEL,
    SPRINT_SYNC_STATES
} from '../../../constants/app-constants';
import { BasicModalComponent } from '../../shared/basic-modal/basic-modal.component';
import { RetrospectiveService } from '../../shared/services/retrospective.service';
import { UtilsService } from '../../shared/utils/utils.service';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Component({
    selector: 'app-sprint-detail',
    templateUrl: './sprint-detail.component.html',
    styleUrls: ['./sprint-detail.component.scss']
})
export class SprintDetailComponent implements OnInit, OnDestroy  {
    sprintDays: number;
    sprintStatus: number;
    selectedValue: number;
    sprintID: any;
    retrospectiveID: any;
    sprintDetails: any;
    selectedTabIndex = 0;
    enableRefresh = true;
    toggleToTriggerRefresh = false;

    refresh$: Subject<number> = new Subject<number>();
    destroy$: Subject<boolean> = new Subject<boolean>();
    dateFormat = DATE_FORMAT;
    decimalFormat = '1.0-2';
    sprintStates = SPRINT_STATES;
    sprintStatesLabel = SPRINT_STATES_LABEL;
    sprintActions = SPRINT_ACTIONS;
    sprintActionsLabel = SPRINT_ACTIONS_LABEL;
    syncStates = SPRINT_SYNC_STATES;
    tabIndexMapping: any = {highlights: 0, taskSummary: 1, memberSummary: 2, notes: 3};

    constructor(
        private retrospectiveService: RetrospectiveService,
        private snackBar: MatSnackBar,
        private router: Router,
        private utils: UtilsService,
        private activatedRoute: ActivatedRoute,
        public dialog: MatDialog,
    ) {
    }

    ngOnInit() {
        const params = this.activatedRoute.snapshot.params;
        this.retrospectiveID = params['retrospectiveID'];
        this.sprintID = params['sprintID'];
        this.refresh$
            .subscribe((delay = 0) => {
                setTimeout(() => {
                    this.getSprintDetails();
                }, delay);
            });
        this.refresh$.next();
        Observable.interval(AUTO_REFRESH_DURATION)
            .takeUntil(this.destroy$)
            .subscribe(() => {
                if (this.enableRefresh) {
                    this.refresh$.next();
                }
            });
    }

    ngOnDestroy() {
        this.refresh$.unsubscribe();
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
    }

    getSprintAssignedPoints() {
        const featureType = this.sprintDetails.Summary.TaskSummary.FeatureTypes.TotalPointsEarned;
        const taskType = this.sprintDetails.Summary.TaskSummary.TaskTypes.TotalPointsEarned;
        const bugType = this.sprintDetails.Summary.TaskSummary.BugTypes.TotalPointsEarned;
        return (featureType + taskType + bugType);
    }

    getSprintDetails(isRefresh = false) {
        if (isRefresh) {
            this.toggleToTriggerRefresh = !this.toggleToTriggerRefresh;
        }
        this.retrospectiveService.getSprintDetails(this.retrospectiveID, this.sprintID).subscribe(
            response => {
                this.sprintDetails = response.data;
                this.sprintStatus = response.data.Status;
                this.selectedValue = ACTIONABLE_SPRINT_STATES[this.sprintStatus];
                this.sprintDays = this.utils.workdayCount(response.data.StartDate, response.data.EndDate);
                if ([this.syncStates.SYNCING, this.syncStates.QUEUED].indexOf(this.sprintDetails.SyncStatus) !== -1
                    && !this.enableRefresh) {
                    this.refresh$.next(AUTO_REFRESH_DURATION);
                }
                if (this.sprintStatus === SPRINT_STATES.DRAFT) {
                    // Since we are hiding the "Highlights" and "Notes" tab for draft sprints,
                    // we need to make sure that the summary tabs are following the correct order.
                    this.tabIndexMapping = {taskSummary: 0, memberSummary: 1};
                }
            },
            err => {
                if (!isRefresh) {
                    this.snackBar.open(
                        this.utils.getApiErrorMessage(err) || API_RESPONSE_MESSAGES.getSprintDetailsError,
                        '', {duration: SNACKBAR_DURATION});
                    this.navigateToRetrospectiveDashboard();
                } else {
                    this.snackBar.open(
                        API_RESPONSE_MESSAGES.sprintDetailsRefreshFailure,
                        '', {duration: SNACKBAR_DURATION});
                }
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
                        this.selectedTabIndex += 1;
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
                content: 'Are you sure you want to Discard sprint?',
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

    resyncSprintDetails() {
        this.retrospectiveService.resyncSprintDetails(this.retrospectiveID, this.sprintID).subscribe(
            () => {
                this.sprintDetails.SyncStatus = SPRINT_SYNC_STATES.QUEUED;
                this.snackBar.open(
                    API_RESPONSE_MESSAGES.sprintComputationInitiated,
                        '', {duration: SNACKBAR_DURATION});
                this.refresh$.next(RESYNC_REFRESH_DURATION);
            },
            err => {
                this.snackBar.open(
                    this.utils.getApiErrorMessage(err) || API_RESPONSE_MESSAGES.resyncSprintError,
                    '', {duration: SNACKBAR_DURATION});
            }
        );
    }

    toggleAutoRefresh() {
        this.enableRefresh = !this.enableRefresh;
    }
}
