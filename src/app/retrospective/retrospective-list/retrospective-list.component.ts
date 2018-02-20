import { Component, OnInit } from '@angular/core';
import { RetrospectiveListDataSource } from './retrospective-list.data-source';
import { RetrospectiveService } from '../../shared/services/retrospective.service';
import { Router } from '@angular/router';
import {APP_ROUTE_URLS, SNACKBAR_DURATION} from '../../../constants/app-constants';
import { API_RESPONSE_MESSAGES } from '../../../constants/app-constants';
import { MatDialog, MatSnackBar } from '@angular/material';
import { RetrospectiveCreateComponent } from '../retrospective-create/retrospective-create.component';

@Component({
  selector: 'app-retrospective-list',
  templateUrl: './retrospective-list.component.html',
  styleUrls: ['./retrospective-list.component.scss']
})
export class RetrospectiveListComponent implements OnInit {
    isDataLoaded = false;

    // These are the possible options for the teams and task providers
    teamOptions: any = [];
    taskProviderOptions: any = [];

    dataSource: RetrospectiveListDataSource;
    displayedColumns = ['title', 'team', 'updated_at', 'latest_sprint'];

    constructor(private service: RetrospectiveService,
                private snackBar: MatSnackBar,
                public dialog: MatDialog,
                private router: Router) { }

    initializeDataSource() {
        this.dataSource = new RetrospectiveListDataSource(this.service);
    }

    navigateToRetroSpectiveDetail(row) {
        // redirect to retro detail page
    }

    showCreateRetroModal() {
        this.getConfigOptions();
        const dialogRef = this.dialog.open(RetrospectiveCreateComponent, {
            width: '90%',
            height: '90%',
            data: {
                teamOptions: this.teamOptions,
                taskProviderOptions: this.taskProviderOptions,
                isDataLoaded: this.isDataLoaded
            },
            maxWidth: 950,
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.createRetro(result);
            }
        });
    }

    navigateToLatestSprint(row) {
        this.service.getRetroSpectiveLatestSprint(row.ID).subscribe((sprintData) => {
            this.router.navigateByUrl(APP_ROUTE_URLS.sprintDetails.replace(
                ':retrospectiveID', row.ID).replace(
                    ':sprintID', sprintData.SprintID));
        });
    }

    ngOnInit() {
        this.initializeDataSource();
    }

    getConfigOptions() {
        this.teamOptions = this.service.getTeamList()['Teams'] || [];
        this.taskProviderOptions = this.service.getTaskProvidersList()['TaskProviders'] || [];
        this.isDataLoaded = true;
    }

    parseToDate(value) {
        if (!value) {
            return '';
        }
        return new Date(value).toDateString();
    }

    createRetro(formValue) {
        const response = this.service.createRetro(formValue);
        if (response.success) {
            this.snackBar.open(API_RESPONSE_MESSAGES.retroCreated, '', {duration: SNACKBAR_DURATION});
            // TODO: Redirect to retro detail page
        } else {
            this.snackBar.open(API_RESPONSE_MESSAGES.error, '', {duration: SNACKBAR_DURATION});
        }
    }

}
