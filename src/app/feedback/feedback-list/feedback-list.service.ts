import { Injectable } from '@angular/core';
import { Restangular } from 'ngx-restangular';
import { Observable } from 'rxjs/Observable';
import { ApiURLMap } from '../../../constants/api-urls';


@Injectable()
export class FeedbackListService {
    constructor(private restAngular: Restangular) {
    }

    getFeedBackList(queryParams): Observable<any> {
        return this.restAngular.one(ApiURLMap.feedback).get(queryParams);
    }
}
