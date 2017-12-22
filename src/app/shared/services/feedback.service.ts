import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Observable } from 'rxjs/Observable';
import { API_URLS } from '../../../constants/api-urls';
import { RestApiHelperService } from "../utils/rest-api-helper.service";


@Injectable()
export class FeedbackService {
    private restangular;

    constructor(private restApiHelperService: RestApiHelperService) {
        this.restangular = restApiHelperService.getDataApiHelper();
    }

    getFeedBacks(queryParams = {}): Observable<any> {
        return this.restangular.one(API_URLS.feedback).get(queryParams);
    }

    getFeedBack(feedbackId): Observable<any> {
        return this.restangular.one(API_URLS.feedback).one(feedbackId).get();
    }

    toFormGroup(questionData, isDisabled = false): FormGroup {
        let skills;
        let formGroup, categoryGroup, skillGroup, questionGroup;
        formGroup = {};
        Object.keys(questionData).forEach(categoryId => {
            categoryGroup = {};
            skills = questionData[categoryId].Skills;
            Object.keys(skills).forEach(skillId => {
                skillGroup = {};
                skills[skillId].Questions.forEach(question => {
                    questionGroup = {
                        'response': new FormControl({
                            value: question.Response || '',
                            disabled: isDisabled
                        }, Validators.required),
                        'comment': new FormControl({value: question.Comment || '', disabled: isDisabled})
                    };
                    skillGroup[question.ResponseID] = new FormGroup(questionGroup);
                });
                categoryGroup[skillId] = new FormGroup(skillGroup);
            });
            formGroup[categoryId] = new FormGroup(categoryGroup);
        });
        return new FormGroup(formGroup);
    }

    submitData(feedbackId, data): Observable<any> {
        return this.restangular.one(API_URLS.feedback, feedbackId).customPUT(data);
    }
}
