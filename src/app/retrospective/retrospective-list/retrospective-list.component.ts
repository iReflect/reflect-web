import { Component, OnInit } from '@angular/core';
import { RetrospectiveListDataSource } from './retrospective-list.data-source';
import { RetrospectiveService } from '../../shared/services/retrospective.service';
import { API_RESPONSE_MESSAGES } from '../../../constants/app-constants';
import { MatDialog, MatSnackBar } from "@angular/material";
import { RetrospectiveCreateComponent } from "../retrospective-create/retrospective-create.component";

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
    displayedColumns = ['title', 'team', 'created_by', 'created_at'];

    constructor(private service: RetrospectiveService,
                private snackBar: MatSnackBar,
                public dialog: MatDialog) { }

    initializeDataSource() {
        this.dataSource = new RetrospectiveListDataSource(this.service);
    }

    navigateToRetroSpectiveDetail(row) {
        // redirect to retro detail page
    }

    createNewRetro() {
        // this.router.navigateByUrl(APP_ROUTE_URLS.retroSpectiveCreate);
        let dialogRef = this.dialog.open(RetrospectiveCreateComponent, {
            width: '90%',
            height: '90%',
            data: {
                teamOptions: this.teamOptions,
                taskProviderOptions: this.taskProviderOptions,
                isDataLoaded: this.isDataLoaded
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            this.createRetro(result);
        });
    }

    ngOnInit() {
        this.getConfigOptions();
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
        let response: any;
        response = this.service.createRetro(formValue);
        if (response.success) {
            this.snackBar.open(API_RESPONSE_MESSAGES.retroCreated, '', {duration: 2000});
            // TODO: Redirect to retro detail page
        } else {
            this.snackBar.open(API_RESPONSE_MESSAGES.error, '', {duration: 2000});
        }
    }

}
