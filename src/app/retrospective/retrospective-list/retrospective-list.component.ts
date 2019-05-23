import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';

import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';

import { API_RESPONSE_MESSAGES, APP_ROUTE_URLS, SNACKBAR_DURATION } from '@constants/app-constants';
import { RetrospectiveCreateComponent } from 'app/retrospective/retrospective-create/retrospective-create.component';
import { RetrospectiveService } from 'app/shared/services/retrospective.service';
import { RetrospectiveDataService } from 'app/shared/services/retrospective-data.service';
import { UserService } from 'app/shared/services/user.service';
import { UtilsService } from 'app/shared/utils/utils.service';

@Component({
    selector: 'app-retrospective-list',
    templateUrl: './retrospective-list.component.html',
    styleUrls: ['./retrospective-list.component.scss']
})
export class RetrospectiveListComponent implements OnInit, OnDestroy {
    public myRetroDataSource: any;
    public othersRetroDataSource: any;
    public displayedColumns = ['title', 'team', 'created_at', 'latest_sprint'];
    public showAll: boolean;
    public isAdmin: boolean;
    private destroy$: Subject<boolean> = new Subject<boolean>();

    constructor(
        private userService: UserService,
        private retrospectiveService: RetrospectiveService,
        private retrospectiveDataService: RetrospectiveDataService,
        private snackBar: MatSnackBar,
        public dialog: MatDialog,
        private router: Router,
        private utils: UtilsService,
        private changeDetectorRefs: ChangeDetectorRef
    ) {
    }

    ngOnInit() {
        this.userService.getCurrentUser().takeUntil(this.destroy$).subscribe(
            response => this.isAdmin = response.data.IsAdmin
        );
        this.showAll = this.retrospectiveDataService.getShowAllRetroState();
        this.initializeDataSource();
    }
    ngOnDestroy() {
        this.destroy$.next(true);
        this.destroy$.complete();
        this.myRetroDataSource = null;
        this.othersRetroDataSource = null;
    }

    initializeDataSource() {
        this.retrospectiveService.getRetrospectives()
            .takeUntil(this.destroy$)
            .subscribe(
                response => {
                    this.myRetroDataSource = response.data.MyRetrospectives;
                    this.othersRetroDataSource = response.data.OthersRetrospectives;
                },
                err => {
                    this.showCannotGetRetrospectivesError(err);
                }
            );
    }

    changeRetrospectiveList() {
        this.retrospectiveDataService.saveShowAllRetroState(!this.showAll);
        this.showAll = !this.showAll;
    }

    showCannotGetRetrospectivesError(err) {
        this.snackBar.open(
            this.utils.getApiErrorMessage(err) || API_RESPONSE_MESSAGES.getRetrospectivesError,
            '', { duration: SNACKBAR_DURATION });
    }

    navigateToRetrospectiveDetail(row) {
        this.router.navigateByUrl(APP_ROUTE_URLS.retrospectiveDashboard.replace(':retrospectiveID', row.ID));
    }

    showCreateRetroModal() {
        const dialogRef = this.dialog.open(RetrospectiveCreateComponent, {
            width: '90%',
            height: '90%',
            maxWidth: 950
        });

        dialogRef.afterClosed().takeUntil(this.destroy$).subscribe(result => {
            if (result) {
                this.initializeDataSource();
                this.changeDetectorRefs.detectChanges();
            }
        });
    }

    navigateToLatestSprint(row) {
        this.retrospectiveService.getRetrospectiveLatestSprint(row.ID)
            .takeUntil(this.destroy$)
            .subscribe(
                response => {
                    this.router.navigateByUrl(APP_ROUTE_URLS.sprintDetails
                        .replace(':retrospectiveID', row.ID)
                        .replace(':sprintID', response.data.ID));
                },
                err => {
                    this.snackBar.open(
                        this.utils.getApiErrorMessage(err) || API_RESPONSE_MESSAGES.noSprintsError,
                        '', { duration: SNACKBAR_DURATION });
                    this.router.navigateByUrl(APP_ROUTE_URLS.retrospectiveDashboard
                        .replace(':retrospectiveID', row.ID));
                }
            );
    }

    parseToDate(value) {
        if (!value) {
            return '';
        }
        return new Date(value).toDateString();
    }
}
