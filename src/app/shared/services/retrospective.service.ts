import { Injectable } from '@angular/core';
import { RestApiHelperService } from '../utils/rest-api-helper.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

// Import Mocked API responses json
import * as RetroSpectiveListJson from '../../../fixtures/retrospective-list-response.json';
import * as RetroSpectiveConfigOptions from '../../../fixtures/retrospective-config-options.json';
import * as RetroSpectiveGetJson from '../../../fixtures/retrospective-get-response.json';
import * as SprintListJson from '../../../fixtures/sprint-list-response.json';


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

    getRetrospectiveByID(retroSpectiveID): Observable<any> {
        // TODO: Replace the dummy json with the Actual API once it is ready
        return Observable.of(RetroSpectiveGetJson[retroSpectiveID]);
    }

    listSprintByRetrospectiveID(retroSpectiveID): Observable<any> {
        // TODO: Replace the dummy json with the Actual API once it is ready
        return Observable.of(SprintListJson);
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

    createSprint(sprintDetails) {
        console.log('Sprint created with values: ' + sprintDetails);
    }
}
