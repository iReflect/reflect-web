import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Restangular } from 'ngx-restangular';
import { ApiURLMap } from '../../constants/api-urls';


@Injectable()
export class HomeService {
  constructor(private restAngular: Restangular) {
  }

  getFeedBackEventList(statuses = []): Observable<any> {
    return this.restAngular.one(ApiURLMap.list_feedback_events).get({'status': statuses});
  }
}
