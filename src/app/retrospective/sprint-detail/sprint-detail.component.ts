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
    sprintDetails: any;
    retrospectiveID: number;
    sprintID: number;
    dateFormat = 'MMMM dd, yyyy';
    sprintStatus;
    selectedValue;
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
        this.activatedRoute.params.subscribe((params: Params) => {
            this.retrospectiveID = params['retrospectiveID'];
            this.sprintID = params['sprintID'];
            this.retrospectiveService.getSprintDetails(this.sprintID).subscribe(
                // TODO: replace this data with response and access data using response.data
                (data) => {
                    this.sprintDetails = data;
                    this.sprintStatus = data.Status;
                },
                () => {
                    this.snackBar.open(API_RESPONSE_MESSAGES.error, '', {duration: SNACKBAR_DURATION});
                }
            );
        });
    }

    navigateToRetrospectiveDashboard() {
        // TODO: change this route to retrospective dashboard
        this.router.navigateByUrl(APP_ROUTE_URLS.retroSpectiveList);
    }

    sprintStateChangeError(errorMessage) {
        if (errorMessage) {
            this.snackBar.open(errorMessage, '', {duration: SNACKBAR_DURATION});
        }
        this.selectedValue = undefined;
    }

    stateChange(action) {
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
                        this.retrospectiveService.activateSprint(this.sprintID).subscribe(
                            () => {
                                this.sprintStatus = this.sprintStates.ACTIVE;
                                this.snackBar.open(API_RESPONSE_MESSAGES.sprintActivated, '', {duration: SNACKBAR_DURATION});
                            },
                            () => this.sprintStateChangeError(API_RESPONSE_MESSAGES.error)
                        );
                    } else if (action === this.sprintActions.FREEZE) {
                        this.retrospectiveService.freezeSprint(this.sprintID).subscribe(
                            () => {
                                this.sprintStatus =  this.sprintStates.FROZEN;
                                this.snackBar.open(API_RESPONSE_MESSAGES.sprintFrozen, '', {duration: SNACKBAR_DURATION});
                            },
                            () => this.sprintStateChangeError(API_RESPONSE_MESSAGES.error)
                        );
                    } else if (action === this.sprintActions.DISCARD) {
                        this.retrospectiveService.discardSprint(this.sprintID).subscribe(
                            () => {
                                this.snackBar.open(API_RESPONSE_MESSAGES.sprintDiscarded, '', {duration: SNACKBAR_DURATION});
                                this.navigateToRetrospectiveDashboard();
                            },
                            () => this.sprintStateChangeError(API_RESPONSE_MESSAGES.error)
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

    initiateComputation() {
        this.retrospectiveService.initiateComputation().subscribe(
            () => {
                this.snackBar.open(API_RESPONSE_MESSAGES.sprintComputationInitiated, '', {duration: SNACKBAR_DURATION});
                this.sprintDetails.isSyncInProgress = true;
            },
            () => {
                this.snackBar.open(API_RESPONSE_MESSAGES.error, '', {duration: SNACKBAR_DURATION});
            }
        );
    }
}
