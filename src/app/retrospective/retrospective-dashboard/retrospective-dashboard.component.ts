import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RetrospectiveService } from '../../shared/services/retrospective.service';
import { MatDialog, MatSnackBar } from '@angular/material';
import { SprintCreateComponent } from '../sprint-create/sprint-create.component';
import { API_RESPONSE_MESSAGES, APP_ROUTE_URLS, SNACKBAR_DURATION } from '../../../constants/app-constants';
import { SprintListComponent } from '../sprint-list/sprint-list.component';

@Component({
  selector: 'app-retrospective-dashboard',
  templateUrl: './retrospective-dashboard.component.html',
  styleUrls: ['./retrospective-dashboard.component.scss']
})
export class RetrospectiveDashboardComponent implements OnInit {
    retrospectiveID: any;
    retrospectiveData: any = {};
    dateFormat = 'MMMM dd, yyyy';
    isDataLoaded = false;
    @ViewChild('sprintList') private sprintList: SprintListComponent;

    constructor(private activatedRoute: ActivatedRoute,
                private retrospectiveService: RetrospectiveService,
                private snackBar: MatSnackBar,
                private router: Router,
                public dialog: MatDialog) {
        this.retrospectiveID = this.activatedRoute.snapshot.params['retrospectiveID'];
    }

    getRetrospective() {
        this.retrospectiveService.getRetrospectiveByID(this.retrospectiveID).subscribe(
        response => {
                this.retrospectiveData = response.data;
                this.isDataLoaded = true;
            },
            () => {
                this.snackBar.open(API_RESPONSE_MESSAGES.invalidRetroAccessError, '', {duration: SNACKBAR_DURATION});
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
