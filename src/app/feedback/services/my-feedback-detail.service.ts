import { Injectable } from '@angular/core';
import { Restangular } from 'ngx-restangular';

import { ApiURLMap } from '../../../constants/api-urls';
import { BaseFeedbackDetailService } from './base-feedback-detail.service';


@Injectable()
export class MyFeedbackDetailService extends BaseFeedbackDetailService {
    apiURL = null;

    constructor(restAngular: Restangular) {
        super(restAngular);
        this.apiURL = ApiURLMap.feedback;
    }
}
