import { Injectable } from '@angular/core';
import 'rxjs/add/operator/filter';
import { API_URLS } from '../../../constants/api-urls';
import { RestApiHelperService } from '../utils/rest-api-helper.service';


@Injectable()
export class UserService {

    private restangular;

    constructor(private restApiHelperService: RestApiHelperService) {
        this.restangular = restApiHelperService.getDataApiHelperWithLoader();
    }

    getCurrentUser() {
        return this.restangular.one(API_URLS.user.current).get();
    }

}
