import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Restangular } from 'ngx-restangular';
import { Observable } from 'rxjs/Observable';
import { ApiURLMap } from '../../../constants/api-urls';
import { QUESTION_TYPES } from "../../../constants/app-constants";


@Injectable()
export class FeedbackDetailService {
    constructor(private restangular: Restangular) {
    }

    getFeedBack(feedbackId): Observable<any> {
        return this.restangular.one(ApiURLMap,feedbackId).get();
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
                    let questionResponse = (question.Response || '').toString();
                    if (question.Type === QUESTION_TYPES.MULTIPLE_CHOICE) {
                        questionResponse = questionResponse.split(',').filter((response) => !!response);
                    }
                    questionGroup = {
                        'response': new FormControl({
                            value: questionResponse,
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

    postData(feedbackId, data): Observable<any> {
        return this.restangular.one(ApiURLMap.feedback, feedbackId).post('', data);
    }
}
