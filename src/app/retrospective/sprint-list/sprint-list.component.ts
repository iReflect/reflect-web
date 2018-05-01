import { ChangeDetectorRef, Component, HostListener, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';

import {
    API_RESPONSE_MESSAGES, SPRINT_STATES_LABEL, APP_ROUTE_URLS, SNACKBAR_DURATION,
    DATE_FORMAT
} from '../../../constants/app-constants';
import { SprintListDataSource } from './sprint-list.data-source';
import { RetrospectiveService } from '../../shared/services/retrospective.service';
import { UtilsService } from '../../shared/utils/utils.service';

@Component({
    selector: 'app-sprint-list',
    templateUrl: './sprint-list.component.html',
    styleUrls: ['./sprint-list.component.scss']
})
export class SprintListComponent implements OnInit {
    @Input() retrospectiveID: any;
    displayedSprintColumns = ['title', 'start_date', 'end_date', 'status', 'created_by', 'last_synced_at'];

    dataSource: SprintListDataSource;
    sprintStates = SPRINT_STATES_LABEL;
    dateFormat = DATE_FORMAT;
    lastScrollTop: number;

    @HostListener('window:scroll', [])
    onWindowScroll() {
        const buffer = 200;
        const limit = window.innerHeight + window.scrollY + buffer;

        // If the user has scrolled within 200px of the bottom and is scrolling down, add more data
        if (limit > document.body.offsetHeight && window.pageYOffset > this.lastScrollTop) {
            this.dataSource.connect();

            // Calling detectChanges here to refresh the value of isSprintsLoading.
            this.changeDetectorRefs.detectChanges();
        }
        this.lastScrollTop = window.pageYOffset;
    }

    constructor(private retrospectiveService: RetrospectiveService,
                private snackBar: MatSnackBar,
                private router: Router,
                private utils: UtilsService,
                private changeDetectorRefs: ChangeDetectorRef) {
    }

    showCannotGetSprintsError(err) {
        this.snackBar.open(this.utils.getApiErrorMessage(err) || API_RESPONSE_MESSAGES.getSprintsError, '', {duration: SNACKBAR_DURATION});
    }

    refresh() {
        this.initializeDataSource();
    }

    initializeDataSource() {
        const documentBody = document.body, documentElement = document.documentElement;
        // Taking the maximum value for the height of the page as it is
        // calculated differently by different Browsers.
        const pageHeight = Math.max( documentBody.scrollHeight, documentBody.offsetHeight,
            documentElement.clientHeight, documentElement.scrollHeight, documentElement.offsetHeight );

        // Passing height/48 as rowsToLoad as min-height of
        // mat-row is set to 48 by default.
        this.dataSource = new SprintListDataSource(
            this.retrospectiveService,
            this.retrospectiveID,
            Math.ceil(pageHeight / 48),
            this.showCannotGetSprintsError.bind(this)
        );

        // Calling detectChanges here to refresh the value of isSprintsLoading.
        this.changeDetectorRefs.detectChanges();
    }

    navigateToSprint(row) {
        this.router.navigateByUrl(
            APP_ROUTE_URLS.sprintDetails.replace(':retrospectiveID', this.retrospectiveID).replace(':sprintID', row.ID)
        );
    }

    ngOnInit() {
        this.initializeDataSource();
    }
}
