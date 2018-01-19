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
    displayedColumns = ['title', 'team', 'created_by', 'created_at'];

    constructor(private service: RetrospectiveService,
                private router: Router) { }

    initializeDataSource() {
        this.dataSource = new RetrospectiveListDataSource(this.service);
    }

    navigateToRetroSpectiveDashboard(row) {
        this.router.navigateByUrl(APP_ROUTE_URLS.retroSpectiveDashboard.replace(':retroSpectiveID', row.ID));
    }

    createNewRetro() {
        this.router.navigateByUrl(APP_ROUTE_URLS.retroSpectiveCreate);
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
