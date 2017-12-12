import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Restangular } from 'ngx-restangular';
import { ApiURLMap } from '../../../constants/api-urls';


@Injectable()
export class LoginService {
  constructor(private restAngular: Restangular) {
  }

  login(credentials: any): Observable<any> {
    return this.restAngular.one(ApiURLMap.login).post('', credentials);
  }
}
