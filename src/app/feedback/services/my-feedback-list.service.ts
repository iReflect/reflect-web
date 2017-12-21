import { Injectable } from '@angular/core';
import { Restangular } from 'ngx-restangular';

import { ApiURLMap } from '../../../constants/api-urls';
import { BaseFeedbackListService } from './base-feedback-list.service';


@Injectable()
export class MyFeedbackListService extends BaseFeedbackListService {
    apiURL = null;

    constructor(restAngular: Restangular) {
        super(restAngular);
        this.apiURL = ApiURLMap.feedback;
    }
}
