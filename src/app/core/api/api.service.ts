import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { LoggerService } from '../logger.service';
import { Observable } from 'rxjs/Observable';

// Service
import { ApiUrlService } from './api-url.service';
import { UserDataStoreService } from '../../shared/data-stores/user-data-store.service';


@Injectable()
export class ApiService {

  headers: HttpHeaders = new HttpHeaders();

  constructor(private http: HttpClient, private urlService: ApiUrlService, private userData: UserDataStoreService,
              private loggerService: LoggerService) {
  }

  private static extractData(res: HttpResponse<any>) {
    return res || {};
  }

  private constructOptions(withCredentials = true) {

    // Always construct new Headers for each Response
    this.headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    if (withCredentials) {
      this.userData.token$.subscribe(
        token => {
          if (token) {
            this.headers.set('Authorization', 'Token ' + token);
          }
        }
      );
    }
  }

  apiGET(urlKey: string, queryParams?: Object, urlParams?: Object): Observable<any> {
    /*
        Entry Method for GET requests to API.
        urlKey and QueryParams are explained in urlService methods as required.
    */

    const url = this.urlService.createURLString(urlKey, queryParams, urlParams);
    this.constructOptions();
    return this.http.get(url, {headers: this.headers})
      .map(ApiService.extractData)
      .catch(this.loggerService.handleError);
  }

  apiPOST(urlKey: string, reqBody: Object, queryParams?: Object, urlParams?: Object, withCredentials = true): Observable<any> {
    /*
        Entry Method for POST requests to API.
        urlKey and QueryParams are explained in urlService methods as required.
        reqBody is Request Body which needs to be sent with request
        withCredentials controls whether we need to send Auth Token with response or not
     */
    const url = this.urlService.createURLString(urlKey, queryParams, urlParams);
    this.constructOptions(withCredentials);
    return this.http.post(url, reqBody, {headers: this.headers})
      .map(ApiService.extractData)
      .catch(this.loggerService.handleError);
  }

  apiDELETE(urlKey: string, urlParams?: Object): Observable<any> {
    const url = this.urlService.createURLString(urlKey, {}, urlParams);
    this.constructOptions();
    return this.http.delete(url, {headers: this.headers})
      .map(ApiService.extractData)
      .catch(this.loggerService.handleError);
  }

  apiPUT(urlKey: string, reqBody: Object, queryParams?: Object, urlParams?: Object, withCredentials = true): Observable<any> {
    /*
        Entry Method for PUT requests to API.
        urlKey and QueryParams are explained in urlService methods as required.
        reqBody is Request Body which needs to be sent with request
        withCredentials controls whether we need to send Auth Token with response or not
     */
    const url = this.urlService.createURLString(urlKey, queryParams, urlParams);
    this.constructOptions(withCredentials);
    return this.http.put(url, reqBody, {headers: this.headers})
      .map(ApiService.extractData)
      .catch(this.loggerService.handleError);
  }
}
