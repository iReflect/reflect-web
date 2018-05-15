import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { RetrospectiveListDataSource } from './retrospective-list.data-source';
import { RetrospectiveService } from '../../shared/services/retrospective.service';
import { Router } from '@angular/router';
import { API_RESPONSE_MESSAGES, APP_ROUTE_URLS, SNACKBAR_DURATION } from '../../../constants/app-constants';
import { MatDialog, MatSnackBar } from '@angular/material';
import { RetrospectiveCreateComponent } from '../retrospective-create/retrospective-create.component';
import { UtilsService } from '../../shared/utils/utils.service';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';

@Component({
    selector: 'app-retrospective-list',
    templateUrl: './retrospective-list.component.html',
    styleUrls: ['./retrospective-list.component.scss']
})
export class RetrospectiveListComponent implements OnInit, OnDestroy {
    dataSource: RetrospectiveListDataSource;
    displayedColumns = ['team', 'created_at', 'latest_sprint'];
    private destroy$: Subject<boolean> = new Subject<boolean>();

    constructor(
        private retrospectiveService: RetrospectiveService,
        private snackBar: MatSnackBar,
        public dialog: MatDialog,
        private router: Router,
        private utils: UtilsService,
        private changeDetectorRefs: ChangeDetectorRef
    ) {
    }

    ngOnInit() {
        this.initializeDataSource();
    }

    ngOnDestroy() {
        this.destroy$.next(true);
        this.destroy$.complete();
        this.dataSource = null;
    }

    initializeDataSource() {
        this.dataSource = new RetrospectiveListDataSource(
            this.retrospectiveService,
            this.showCannotGetRetrospectivesError.bind(this)
        );
    }

    showCannotGetRetrospectivesError(err) {
        this.snackBar.open(
            this.utils.getApiErrorMessage(err) || API_RESPONSE_MESSAGES.getRetrospectivesError,
            '', {duration: SNACKBAR_DURATION});
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
                        '', {duration: SNACKBAR_DURATION});
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
