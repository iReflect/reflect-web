import { Injectable } from '@angular/core';
import * as RetroSpectiveListJson from '../../../fixtures/retrospective-list-response.json';
import * as RetroSpectiveConfigOptions from '../../../fixtures/retrospective-config-options.json';
import { RestApiHelperService } from '../utils/rest-api-helper.service';
import { Observable } from 'rxjs/Observable';


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
}
