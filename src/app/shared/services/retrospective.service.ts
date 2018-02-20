import { Injectable } from '@angular/core';
import * as RetroSpectiveListJson from '../../../fixtures/retrospective-list-response.json';
import * as RetroSpectiveConfigOptions from '../../../fixtures/retrospective-config-options.json';
import * as SprintListJson from '../../../fixtures/sprint-list-response.json';
import { RestApiHelperService } from '../utils/rest-api-helper.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import {API_URLS} from "../../../constants/api-urls";


@Injectable()
export class RetrospectiveService {
    private restangular;

    constructor(private restApiHelperService: RestApiHelperService) {
        this.restangular = restApiHelperService.getDataApiHelper();
    }

    getRetrospectives(): any {
        // TODO: Replace the dummy json with the Actual API once it is ready
        return RetroSpectiveListJson;
    }

    getRetroSpectiveLatestSprint(retroSpectiveID): Observable<any> {
        // TODO: Replace the dummy json with the Actual API once it is ready
        return Observable.of({
            SprintID: 10
        });
    }

    getTeamList(): any {
        // TODO: Replace the dummy json with the Actual API once it is ready
        return {'Teams': RetroSpectiveConfigOptions['Teams']};
    }

    getTaskProvidersList(): any {
        // TODO: Replace the dummy json with the Actual API once it is ready
        return {'TaskProviders': RetroSpectiveConfigOptions['TaskProviders']};
    }

    createRetro(retroConfig: any): any {
        // TODO: Replace the dummy json with the Actual API once it is ready
        console.log(retroConfig);
        return {success: true, error: ''};
    }

    getSprintDetails(id: number): Observable<any> {
        // TODO: Replace the dummy json with the actual API once it is ready
        const sprints = SprintListJson['Sprints'];
        if(sprints.length >= id) {
            return Observable.of(sprints[id-1]);
        } else {
            return Observable.throw('An Error Occured');
        }
    }

    activateSprint(sprintID): Observable<any> {
        return this.changeSprintStatus(API_URLS.activateSprint.replace(':sprintID', sprintID));
    }

    freezeSprint(sprintID): Observable<any> {
        return this.changeSprintStatus(API_URLS.freezeSprint.replace(':sprintID', sprintID));
    }

    discardSprint(sprintID): Observable<any> {
        return this.changeSprintStatus(API_URLS.discardSprint.replace(':sprintID', sprintID));
    }

    changeSprintStatus(url): Observable<any> {
        // TODO: Make API calls with passed url
        const odds = Math.floor(Math.random() * Math.floor(2));
        if (odds) {
            return Observable.of({});
        } else {
            return Observable.throw('Some Error!');
        }
    }

    initiateComputation(): Observable<any> {
        // TODO: Make API Calls
        const odds = Math.floor(Math.random() * Math.floor(2));
        if (odds) {
            return Observable.of({});
        } else {
            return Observable.throw('Some Error!');
        }
    }
}
