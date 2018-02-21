import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RetrospectiveService } from '../../shared/services/retrospective.service';
import { MatDialog, MatSnackBar } from '@angular/material';
import { SprintCreateComponent } from '../sprint-create/sprint-create.component';
import { API_RESPONSE_MESSAGES, APP_ROUTE_URLS } from '../../../constants/app-constants';

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

    constructor(private activatedRoute: ActivatedRoute,
                private service: RetrospectiveService,
                private snackBar: MatSnackBar,
                private router: Router,
                public dialog: MatDialog) {
        this.retrospectiveID = this.activatedRoute.snapshot.params['retrospectiveID'];
    }

    getRetrospective() {
        this.service.getRetrospectiveByID(this.retrospectiveID).subscribe(
        response => {
                this.retrospectiveData = response.data;
                this.isDataLoaded = true;
            },
            err => {
                this.snackBar.open(API_RESPONSE_MESSAGES.invalidRetroAccessError, '', {duration: 2000});
                this.router.navigateByUrl(APP_ROUTE_URLS.retrospectiveList);
            }
        );
    }

    getCreatorName() {
        return (this.retrospectiveData.CreatedBy.FirstName + ' ' + this.retrospectiveData.CreatedBy.LastName);
    }

    showNewSprintDialog() {
        const dialogRef = this.dialog.open(SprintCreateComponent, {
            width: '70%',
            height: '70%',
            maxWidth: 950,
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.service.createSprint(this.retrospectiveID, result).subscribe(
                    response => {
                        this.snackBar.open(API_RESPONSE_MESSAGES.sprintCreated, '', {duration: 2000});
                        // TODO: Fix this: Redirect to sprint details page
                        this.router.navigateByUrl(APP_ROUTE_URLS.sprintDetails.replace(':retrospectiveID', this.retrospectiveID).replace(':sprintID', response.data.ID));
                    },
                    () => {
                        this.snackBar.open(API_RESPONSE_MESSAGES.sprintCreateError, '', {duration: 2000});
                    }
                );
            }
        });
    }

    ngOnInit() {
        this.getRetrospective();
    }

}
