import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Restangular } from 'ngx-restangular';
import { ApiURLMap } from '../../../constants/api-urls';


@Injectable()
export class FeedbackFormListService {
  constructor(private restAngular: Restangular) {
  }

  getFeedBackEventList(queryParams): Observable<any> {
    return this.restAngular.one(ApiURLMap.list_feedback_events).get(queryParams);
  }
}
