import { Injectable } from '@angular/core';
import { ApiService } from '../core/api/api.service';
import { Observable } from 'rxjs/Observable';


@Injectable()
export class HomeService {
  constructor(private apiService: ApiService) {
  }

  getFeedBackEventList(statuses = []): Observable<any> {
    return this.apiService.apiGET('list_feedback_events', {'status': statuses});
  }
}
