import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { URLSearchParams } from '@angular/http';


import * as _ from 'lodash';

@Injectable()
export class UrlHelperService {

    constructor(private location: Location) {
    }

    public updateQueryParams(data: Object) {
        /**
         * data: data to be stored in query params without changing or reloading any component.
         * update: whether to update the query params or append value.
         */
            // TODO: check alternate of URLSearchParams & update the code with recommended method.
        const params = new URLSearchParams();
        _.forEach(data, (value: any, key) => {
            if (value || value === false) {
                if (value instanceof Array) {
                    value.forEach(v => params.append(key, v));
                } else {
                    params.set(key, value);
                }
            }
        });
        this.location.replaceState(window.location.pathname, params.toString());
    }

}
