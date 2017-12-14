import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Restangular } from 'ngx-restangular';
import { ApiURLMap } from '../../../constants/api-urls';
import {MULTIPLE_CHOICE_TYPE_QUESTION} from "../../../constants/app-constants";


@Injectable()
export class FeedbackFormService {
  constructor(private restangular: Restangular) {
  }

  getFeedBackEventDetails(feedback_form_id): Observable<any> {
    return this.restangular.one(ApiURLMap.feedback_event_details.replace(':id', feedback_form_id)).get();
  }

  toFormGroup(question_data, isDisabled = false): FormGroup {
    let skills;
    let formGroup, categoryGroup, skillGroup, questionGroup;
    formGroup = {};
    Object.keys(question_data).forEach(categoryId => {
      categoryGroup = {};
      skills = question_data[categoryId].Skills;
      Object.keys(skills).forEach(skillId => {
        skillGroup = {};
        skills[skillId].Questions.forEach(question => {
          let questionResponse = (question.Response || '').toString();
          if (question.Type === MULTIPLE_CHOICE_TYPE_QUESTION) {
            questionResponse = questionResponse.split(',').filter((response) => !!response);
          }
          questionGroup = {
            'response': new FormControl({value: questionResponse, disabled: isDisabled}, Validators.required),
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

  postData(feedbackFormID, data): Observable<any> {
    return this.restangular.one(ApiURLMap.feedback_event_details.replace(':id', feedbackFormID))
      .post('', data);
  }
}
