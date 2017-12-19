import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { URLSearchParams } from '@angular/http';

import * as _ from 'lodash';

@Injectable()
export class UtilsService {

    constructor(private location: Location) {
    }

    public getParameterByName(name, url) {
        /**
         * name: name of the parameter.
         * url: complete url including domain.
         */
        if (!url) {
            url = window.location.href;
        }
        name = name.replace(/[\[\]]/g, '\\$&');
        const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'), results = regex.exec(url);
        if (!results) {
            return null;
        }
        if (!results[2]) {
            return '';
        }
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }

    public updateQueryStringParameter(uri, key, value) {
        /**
         * uri: complete uri including domain.
         * key: key of query param.
         * value: value to be set.
         */
        const re = new RegExp('([?&])' + key + '=.*?(&|$)', 'i');
        const separator = uri.indexOf('?') !== -1 ? '&' : '?';
        if (uri.match(re)) {
            return uri.replace(re, '$1' + key + '=' + value + '$2');
        } else {
            return uri + separator + key + '=' + value;
        }
    }

    public transformObjectToQueryParams(queryParams = {}): string {
        /*
         Query Params format: Object
         Keys are string, while values are either string, or Array of strings
         Example:
         {
         'sort': 'popularity',
         'search': ['angular', 'typescript']
         }
         This will result in sort=popularity&search=angular&search=typescript
        */
        let res = '';
        Object.keys(queryParams).forEach(
            key => {
                if (Array.isArray(queryParams[key])) {
                    queryParams[key].forEach(val => res += key + '=' + val + '&');
                } else {
                    res += key + '=' + queryParams[key] + '&';
                }
            }
        );

        // Trim appending &
        return (res.length && res[res.length - 1] === '&') ? res.substring(0, res.length - 1) : res;
    }

    public updateQueryParams(data: Object, update = true) {
        /**
         * data: data to be stored in query params without changing or reloading any component.
         * update: whether to update the query params or append value.
         */
        const params = new URLSearchParams(window.location.search.substring(1));
        _.forEach(data, (value: any, key) => {
            if (value || value === false) {
                update ? params.set(key, value) : params.append(key, value);
            } else {
                params.delete(key);
            }
        });
        this.location.replaceState(window.location.pathname, params.toString());
    }

}
