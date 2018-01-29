import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RetrospectiveService } from '../../shared/services/retrospective.service';
import { MatDialog, MatSnackBar } from '@angular/material';
import { SprintCreateComponent } from '../sprint-create/sprint-create.component';
import { API_RESPONSE_MESSAGES } from '../../../constants/app-constants';

@Component({
  selector: 'app-retrospective-dashboard',
  templateUrl: './retrospective-dashboard.component.html',
  styleUrls: ['./retrospective-dashboard.component.scss']
})
export class RetrospectiveDashboardComponent implements OnInit {

    retroSpectiveData: any = {};
    dateFormat = 'MMMM dd, yyyy';
    isDataLoaded = false;

    constructor(private activatedRoute: ActivatedRoute,
                private service: RetrospectiveService,
                private snackBar: MatSnackBar,
                public dialog: MatDialog) { }

    getRetroSpective() {
        this.service.getRetrospectiveByID(this.activatedRoute.snapshot.params['retroSpectiveID']).subscribe((data) => {
            this.retroSpectiveData = data['RetroSpective'];
            this.isDataLoaded = true;
        });
    }

    getCreatorName() {
        return (this.retroSpectiveData.CreatedBy.FirstName + ' ' + this.retroSpectiveData.CreatedBy.LastName);
    }

    showNewSprintDialog() {
        const dialogRef = this.dialog.open(SprintCreateComponent, {
            width: '70%',
            height: '70%',
            data: {
            },
            maxWidth: 950,
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.createSprint(result);
            }
        });
    }

    createSprint(formValue) {
        const response = this.service.createRetro(formValue);
        if (response.success) {
            this.snackBar.open(API_RESPONSE_MESSAGES.sprintCreated, '', {duration: 2000});
            // TODO: Redirect to sprint details page
        } else {
            this.snackBar.open(API_RESPONSE_MESSAGES.error, '', {duration: 2000});
        }
    }

    ngOnInit() {
        this.getRetroSpective();
    }

}
