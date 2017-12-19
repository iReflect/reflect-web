import { Injectable } from '@angular/core';
import { Restangular } from 'ngx-restangular';
import { Observable } from 'rxjs/Observable';
import { ApiURLMap } from '../../constants/api-urls';


@Injectable()
export class HomeService {
    constructor(private restAngular: Restangular) {
    }

    getFeedBacks(): Observable<any> {
        return this.restAngular.one(ApiURLMap.feedback).get();
    }
}
