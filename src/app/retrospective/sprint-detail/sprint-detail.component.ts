import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MatDialog, MatSnackBar } from '@angular/material';
import { RetrospectiveService } from '../../shared/services/retrospective.service';
import { API_RESPONSE_MESSAGES, APP_ROUTE_URLS, SPRINT_STATES_LABEL } from '../../../constants/app-constants';
import { BasicModalComponent } from '../../shared/basic-modal/basic-modal.component';

@Component({
  selector: 'app-sprint-detail',
  templateUrl: './sprint-detail.component.html',
  styleUrls: ['./sprint-detail.component.scss']
})
export class SprintDetailComponent implements OnInit {
    sprintDetails: any;
    retrospectiveId: number;
    sprintId: number;
    dateFormat = 'MMMM dd, yyyy';
    sprintStatus;
    selectedValue;

    constructor(private retrospectiveService: RetrospectiveService,
                private snackBar: MatSnackBar,
                private router: Router,
                public dialog: MatDialog,
                private activatedRoute: ActivatedRoute) { }

    ngOnInit() {
        this.activatedRoute.params.subscribe((params: Params) => {
            this.sprintId = params['sprintId'];
            this.retrospectiveId = params['retrospectiveId'];
        });
        this.retrospectiveService.getSprintDetails(this.sprintId).subscribe(
            (data) => {
                this.sprintDetails = data;
            },
            () => {
                this.snackBar.open(API_RESPONSE_MESSAGES.error, '', {duration: 2000});
            }
        );
        this.sprintStatus = SPRINT_STATES_LABEL[this.sprintDetails.Status];
    }

    navigateToRetrospectiveDashboard() {
        this.router.navigateByUrl(APP_ROUTE_URLS.retroSpectiveList + '/' + this.retrospectiveId);
    }

    stateChange(action) {
        if (action) {
            const dialogRef = this.dialog.open(BasicModalComponent, {
                data: {
                    content: 'Are you sure you want to ' + action + ' sprint?',
                    confirmBtn: 'Yes',
                    cancelBtn: 'Cancel'
                },
                disableClose: true
            });

            dialogRef.afterClosed().subscribe(result => {
                if (result) {
                    if(action === 'activate') {
                        this.retrospectiveService.activateSprint().subscribe(
                            () => {
                                this.sprintStatus = 'Active';
                                this.snackBar.open(API_RESPONSE_MESSAGES.sprintActivated, '', {duration: 2000});
                            },
                            () => {
                                this.snackBar.open(API_RESPONSE_MESSAGES.error, '', {duration: 2000});
                                this.selectedValue = undefined;
                            }
                        );
                    } else if (action === 'freeze') {
                        this.retrospectiveService.freezeSprint().subscribe(
                            () => {
                                this.sprintStatus = 'Frozen';
                                this.snackBar.open(API_RESPONSE_MESSAGES.sprintFrozen, '', {duration: 2000});
                            },
                            () => {
                                this.snackBar.open(API_RESPONSE_MESSAGES.error, '', {duration: 2000});
                                this.selectedValue = undefined;
                            }
                        );
                    } else if (action === 'discard') {
                        this.retrospectiveService.discardSprint().subscribe(
                            () => {
                                this.snackBar.open(API_RESPONSE_MESSAGES.sprintDiscarded, '', {duration: 2000});
                                this.navigateToRetrospectiveDashboard();
                            },
                            () => {
                                this.snackBar.open(API_RESPONSE_MESSAGES.error, '', {duration: 2000});
                                this.selectedValue = undefined;
                            }
                        );
                    } else {
                        this.snackBar.open(API_RESPONSE_MESSAGES.error, '', {duration: 2000});
                        this.selectedValue = undefined;
                    }
                } else {
                    this.selectedValue = undefined;
                }
            });

        } else {
            this.selectedValue = undefined;
        }
    }

    initiateComputation() {
        // TODO: Make API Calls
        this.retrospectiveService.initiateComputation().subscribe(
            () => {
                this.snackBar.open(API_RESPONSE_MESSAGES.computationInitiated, '', {duration: 2000});
                this.sprintStatus.isSyncInProgress = true;
            },
            () => {
                this.snackBar.open(API_RESPONSE_MESSAGES.error, '', {duration: 2000});
            }
        );
    }
}
