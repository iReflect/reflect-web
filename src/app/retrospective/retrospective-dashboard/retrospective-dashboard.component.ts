import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MatSnackBar } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';

import 'rxjs/add/operator/takeUntil';
import { Subject } from 'rxjs/Subject';

import { API_RESPONSE_MESSAGES, APP_ROUTE_URLS, DATE_FORMAT, SNACKBAR_DURATION } from '@constants/app-constants';
import { RetrospectiveEditComponent } from 'app/retrospective/retrospective-edit/retrospective-edit.component';
import { SprintCreateComponent } from 'app/retrospective/sprint-create/sprint-create.component';
import { SprintListComponent } from 'app/retrospective/sprint-list/sprint-list.component';
import { RetrospectiveService } from 'app/shared/services/retrospective.service';
import { UtilsService } from 'app/shared/utils/utils.service';

@Component({
    selector: 'app-retrospective-dashboard',
    templateUrl: './retrospective-dashboard.component.html',
    styleUrls: ['./retrospective-dashboard.component.scss']
})
export class RetrospectiveDashboardComponent implements OnInit, OnDestroy {
    retrospectiveID: any;
    retrospectiveData: any = {};
    dateFormat = DATE_FORMAT;
    isDataLoaded = false;
    private destroy$: Subject<boolean> = new Subject<boolean>();
    private sprintCreateDialogRef: MatDialogRef<SprintCreateComponent>;

    @ViewChild('sprintList') private sprintList: SprintListComponent;

    constructor(
        private activatedRoute: ActivatedRoute,
        private retrospectiveService: RetrospectiveService,
        private snackBar: MatSnackBar,
        private router: Router,
        private utils: UtilsService,
        public dialog: MatDialog
    ) {
        this.retrospectiveID = this.activatedRoute.snapshot.params['retrospectiveID'];
    }

    ngOnInit() {
        this.getRetrospective();
    }

    ngOnDestroy() {
        this.destroy$.next(true);
        this.destroy$.complete();
        if (this.sprintCreateDialogRef) {
            this.sprintCreateDialogRef.close();
        }
    }

    navigateToRetrospectives() {
        this.router.navigateByUrl(APP_ROUTE_URLS.retrospectiveList);
    }

    getRetrospective() {
        this.retrospectiveService.getRetrospectiveByID(this.retrospectiveID)
            .takeUntil(this.destroy$)
            .subscribe(
                response => {
                    this.retrospectiveData = response.data;
                    this.isDataLoaded = true;
                },
                err => {
                    this.snackBar.open(
                        this.utils.getApiErrorMessage(err) || API_RESPONSE_MESSAGES.invalidRetroAccessError,
                        '', {duration: SNACKBAR_DURATION});
                    this.router.navigateByUrl(APP_ROUTE_URLS.retrospectiveList);
                }
            );
    }

    getCreatorName() {
        return (this.retrospectiveData.CreatedBy.FirstName + ' ' + this.retrospectiveData.CreatedBy.LastName).trim();
    }

    showUpdateRetroDialog() {
        const dialogRef = this.dialog.open(RetrospectiveEditComponent, {
            width: '90%',
            height: '90%',
            maxWidth: 950,
            data : {
                retrospective: this.retrospectiveData,
            }
        });

        dialogRef.afterClosed().takeUntil(this.destroy$).subscribe(result => {
            if (result) {
                this.getRetrospective();
            }
        });
    }

    showNewSprintDialog() {
        this.sprintCreateDialogRef = this.dialog.open(SprintCreateComponent, {
            width: '70%',
            maxWidth: 950,
            data: {
                retrospectiveID: this.retrospectiveID
            }
        });

        this.sprintCreateDialogRef.afterClosed().takeUntil(this.destroy$).subscribe(result => {
            if (result) {
                this.refreshSprintsList();
            }
        });
    }

    refreshSprintsList() {
        this.sprintList.refresh();
    }
}
