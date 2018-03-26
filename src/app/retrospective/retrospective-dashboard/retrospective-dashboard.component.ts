import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RetrospectiveService } from '../../shared/services/retrospective.service';
import { MatDialog, MatSnackBar } from '@angular/material';
import { SprintCreateComponent } from '../sprint-create/sprint-create.component';
import { API_RESPONSE_MESSAGES, APP_ROUTE_URLS, DATE_FORMAT, SNACKBAR_DURATION } from '../../../constants/app-constants';
import { SprintListComponent } from '../sprint-list/sprint-list.component';
import { UtilsService } from '../../shared/utils/utils.service';

@Component({
    selector: 'app-retrospective-dashboard',
    templateUrl: './retrospective-dashboard.component.html',
    styleUrls: ['./retrospective-dashboard.component.scss']
})
export class RetrospectiveDashboardComponent implements OnInit {
    retrospectiveID: any;
    retrospectiveData: any = {};
    dateFormat = DATE_FORMAT;
    isDataLoaded = false;
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

    navigateToRetrospectives() {
        this.router.navigateByUrl(APP_ROUTE_URLS.retrospectiveList);
    }

    getRetrospective() {
        this.retrospectiveService.getRetrospectiveByID(this.retrospectiveID).subscribe(
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

    showNewSprintDialog() {
        const dialogRef = this.dialog.open(SprintCreateComponent, {
            width: '70%',
            maxWidth: 950,
            data: {
                retrospectiveID: this.retrospectiveID
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.sprintList.refresh();
            }
        });
    }

    ngOnInit() {
        this.getRetrospective();
    }
}
