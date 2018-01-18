import { Component, OnInit } from '@angular/core';
import { RetrospectiveListDataSource } from './retrospective-list.data-source';
import { RetrospectiveService } from '../../shared/services/retrospective.service';
import { Router } from '@angular/router';
import { APP_ROUTE_URLS } from '../../../constants/app-constants';

@Component({
  selector: 'app-retrospective-list',
  templateUrl: './retrospective-list.component.html',
  styleUrls: ['./retrospective-list.component.scss']
})
export class RetrospectiveListComponent implements OnInit {

    dataSource: RetrospectiveListDataSource;
    displayedColumns = ['title', 'team', 'updated_at', 'latest_sprint'];

    constructor(private service: RetrospectiveService, private router: Router) { }

    initializeDataSource() {
        this.dataSource = new RetrospectiveListDataSource(this.service);
    }

    navigateToRetroSpectiveDetail(row) {
        // redirect to retro detail page
    }

    createNewRetro() {
        // redirect to create new retro page
    }

    navigateToLatestSprint(row) {
        this.service.getRetroSpectiveLatestSprint(row.ID).subscribe((sprintData) => {
            alert('Redirecting to the sprint dashboard');
            this.router.navigateByUrl(APP_ROUTE_URLS.sprintDashboard.replace(
                ':retrospectiveID', row.ID).replace(
                    ':sprintID', sprintData.SprintID));
        });
    }

    ngOnInit() {
        this.initializeDataSource();
    }

    parseToDate(value) {
        if (!value) {
            return '';
        }
        return new Date(value).toDateString();
    }
}
