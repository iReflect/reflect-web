import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { API_URLS } from '../../../constants/api-urls';
import { RestApiHelperService } from '../utils/rest-api-helper.service';


@Injectable()
export class TeamFeedbackService {
    private restangular;

    constructor(private restApiHelperService: RestApiHelperService) {
        this.restangular = restApiHelperService.getDataApiHelper();
    }

    getFeedBacks(queryParams = {}): Observable<any> {
        return this.restangular.one(API_URLS.teamFeedback).get(queryParams);
    }

    getFeedBack(feedbackId): Observable<any> {
        return this.restangular.one(API_URLS.teamFeedback).one(feedbackId).get();
    }

    toFormGroup(questionData, isDisabled = true): FormGroup {
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
                            disabled: true
                        }, Validators.required),
                        'comment': new FormControl({value: question.Comment || '', disabled: true})
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
        throw "Not Implemented Error"
    }
}
