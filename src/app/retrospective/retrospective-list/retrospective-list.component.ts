import { Component, OnInit } from '@angular/core';
import { RetrospectiveListDataSource } from './retrospective-list.data-source';
import { RetrospectiveService } from '../../shared/services/retrospective.service';

@Component({
  selector: 'app-retrospective-list',
  templateUrl: './retrospective-list.component.html',
  styleUrls: ['./retrospective-list.component.scss']
})
export class RetrospectiveListComponent implements OnInit {

    dataSource: RetrospectiveListDataSource;
    displayedColumns = ['title', 'team', 'created_by', 'created_at'];

    constructor(private service: RetrospectiveService) { }

    initializeDataSource() {
        this.dataSource = new RetrospectiveListDataSource(this.service);
    }

    navigateToRetroSpectiveDetail(row) {
        // redirect to retro detail page
    }

    createNewRetro() {
        // redirect to create new retro page
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
