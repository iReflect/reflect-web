import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MatDialog, MatSnackBar } from '@angular/material';
import { RetrospectiveService } from '../../shared/services/retrospective.service';
import {
    API_RESPONSE_MESSAGES, APP_ROUTE_URLS, SNACKBAR_DURATION, SPRINT_ACTIONS, SPRINT_ACTIONS_LABEL, SPRINT_STATES,
    SPRINT_STATES_LABEL
} from '../../../constants/app-constants';
import { BasicModalComponent } from '../../shared/basic-modal/basic-modal.component';
import * as _ from 'lodash';

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

    dateFormat = 'MMMM dd, yyyy';
    sprintStates = SPRINT_STATES;
    sprintStatesLabel = SPRINT_STATES_LABEL;
    sprintActions = SPRINT_ACTIONS;
    sprintActionsLabel = SPRINT_ACTIONS_LABEL;


    constructor(private retrospectiveService: RetrospectiveService,
                private snackBar: MatSnackBar,
                private router: Router,
                public dialog: MatDialog,
                private activatedRoute: ActivatedRoute) { }

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
                // TODO: set it to working days in api
                this.sprintDays = Math.ceil(
                    Math.abs(Date.parse(response.data['EndDate']) -  Date.parse(response.data['StartDate'])) / (1000 * 3600 * 24)
                );

            },
            err => {
                this.snackBar.open(err.data, '', {duration: SNACKBAR_DURATION});
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

    sprintStateChange(action) {
        if (_.includes(this.sprintActions, action)) {
            const dialogRef = this.dialog.open(BasicModalComponent, {
                data: {
                    content: 'Are you sure you want to ' + this.sprintActionsLabel[action] + ' sprint?',
                    confirmBtn: 'Yes',
                    cancelBtn: 'Cancel'
                },
                disableClose: true
            });

            dialogRef.afterClosed().subscribe(result => {
                if (result) {
                    if (action === this.sprintActions.ACTIVATE) {
                        this.retrospectiveService.activateSprint(this.retrospectiveID, this.sprintID).subscribe(
                            () => {
                                this.sprintStatus = this.sprintStates.ACTIVE;
                                this.snackBar.open(API_RESPONSE_MESSAGES.sprintActivated, '', {duration: SNACKBAR_DURATION});
                            },
                            err => this.sprintStateChangeError(err.error)
                        );
                    } else if (action === this.sprintActions.FREEZE) {
                        this.retrospectiveService.freezeSprint(this.retrospectiveID, this.sprintID).subscribe(
                            () => {
                                this.sprintStatus =  this.sprintStates.FROZEN;
                                this.snackBar.open(API_RESPONSE_MESSAGES.sprintFrozen, '', {duration: SNACKBAR_DURATION});
                            },
                            err => this.sprintStateChangeError(err.error)
                        );
                    } else if (action === this.sprintActions.DISCARD) {
                        this.retrospectiveService.discardSprint(this.sprintID).subscribe(
                            () => {
                                this.snackBar.open(API_RESPONSE_MESSAGES.sprintDiscarded, '', {duration: SNACKBAR_DURATION});
                                this.navigateToRetrospectiveDashboard();
                            },
                            err => this.sprintStateChangeError(err.error)
                        );
                    } else {
                        this.sprintStateChangeError('Please select a valid option!');
                    }
                } else {
                    this.sprintStateChangeError('');
                }
            });
        }
    }

    refreshSprintDetails() {
        this.retrospectiveService.refreshSprintDetails(this.retrospectiveID, this.sprintID).subscribe(
            () => {
                this.snackBar.open(API_RESPONSE_MESSAGES.sprintComputationInitiated, '', {duration: SNACKBAR_DURATION});
                this.sprintDetails.CurrentlySyncing = true;
            },
            err => {
                this.snackBar.open(err.error, '', {duration: SNACKBAR_DURATION});
            }
        );
    }
}
