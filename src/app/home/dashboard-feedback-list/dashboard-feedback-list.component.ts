import {Component, Input, OnInit} from '@angular/core';
import {HomeService} from '../home.service';
import {ActivatedRoute, Router} from '@angular/router';
import {FeedBackListDataSource} from '../../feedback/feedback-list/feedback-list.data-source';

@Component({
  selector: 'app-dashboard-feedback-list',
  templateUrl: './dashboard-feedback-list.component.html',
  styleUrls: ['./dashboard-feedback-list.component.scss']
})
export class DashboardFeedbackListComponent implements OnInit {

    @Input()
    service: HomeService;

    @Input()
    feedbackDetailURL: string;

    @Input()
    filters: any;

    isListLoaded = false;
    displayedColumns = ['title', 'user', 'userRole'];

    // TODO: using feedback's data source for now, either create a separate data source or move it to shared.
    dataSource: FeedBackListDataSource;

    constructor(private router: Router) {
    }

    ngOnInit() {
        this.dataSource = new FeedBackListDataSource(this.service);
        const appliedFilters = Object.assign({}, this.filters);
        this.dataSource.setFilters(appliedFilters);
        this.dataSource.connect();
        this.dataSource.dataChange$.subscribe(data => {
            this.isListLoaded = true;
        });
    }

    navigateToFeedBack(row) {
        this.router.navigateByUrl(this.feedbackDetailURL.replace(':id', row.ID));
    }

    getUser(profile) {
        return (profile && profile.User) ? (profile.User.FirstName + ' ' + profile.User.LastName).trim() : '';
    }

    getUserRole(profile) {
        return (profile && profile.Role) ? profile.Role.Name : '';
    }
}
