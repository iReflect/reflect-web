import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RetrospectiveService } from '../../shared/services/retrospective.service';

@Component({
  selector: 'app-retrospective-dashboard',
  templateUrl: './retrospective-dashboard.component.html',
  styleUrls: ['./retrospective-dashboard.component.scss']
})
export class RetrospectiveDashboardComponent implements OnInit {

    retroSpectiveData: any = {};
    dateFormat = 'MMMM dd, yyyy';
    isDataLoaded = false;

    constructor(private activatedRoute: ActivatedRoute, private service: RetrospectiveService) { }

    getRetroSpective() {
        this.service.getRetrospectiveByID(this.activatedRoute.snapshot.params['retroSpectiveID']).subscribe((data) => {
            this.retroSpectiveData = data['RetroSpective'];
            this.isDataLoaded = true;
        });
    }

    getCreatorName() {
        return (this.retroSpectiveData.CreatedBy.FirstName + ' ' + this.retroSpectiveData.CreatedBy.LastName);
    }

    createNewSprint() {
        // Creates a new sprint in the retrospective
        alert('Opening modal to create a new sprint');
    }

    ngOnInit() {
        this.getRetroSpective();
    }

}
