import { Location } from '@angular/common';
import { Injectable } from '@angular/core';

import { environment } from '../../../environments/environment';
import {ApiURLMap, BASE_API_URL} from '../../../constants/api-urls';
import { UtilsService } from '../../shared/utils/utils.service';

@Injectable()
export class ApiUrlService {

  constructor(private utils: UtilsService) {}

  public createURLString(key: string, queryParams = {}, urlParams = {}): string {
      /*
         Create an URL String given query parameters and URL Key.
         URL Keys defined in api-urls.ts
      */

      queryParams = Location.normalizeQueryParams(this.utils.transformObjectToQueryParams(queryParams));

      let url = ApiURLMap[key].replace(/\/:(\w+)\//g, function(match, keyword) {
          return urlParams[keyword] ? '/' + urlParams[keyword] + '/' : match;
      });
      url = BASE_API_URL.concat(url.concat(queryParams));

      if (environment.production) {
          return url;
      } else {
          let domain_url = window.location.protocol + '//' + window.location.hostname;
          if (environment.API_PORT) {
              domain_url += ':' + environment.API_PORT;
          }
          return domain_url + url;
      }
  }
}
