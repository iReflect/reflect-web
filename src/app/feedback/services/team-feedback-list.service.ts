import { Injectable } from '@angular/core';
import { Restangular } from 'ngx-restangular';

import { ApiURLMap } from '../../../constants/api-urls';
import { BaseFeedbackListService } from './base-feedback-list.service';


@Injectable()
export class TeamFeedbackListService extends BaseFeedbackListService {
    apiURL = null;

    constructor(restAngular: Restangular) {
        super(restAngular);
        this.apiURL = ApiURLMap.teamFeedback;
    }
}
