import { Injectable } from '@angular/core';
import * as RetroSpectiveListJson from '../../../fixtures/retrospective-list-response.json';
import { RestApiHelperService } from '../utils/rest-api-helper.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';


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
}
