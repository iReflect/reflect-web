import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Restangular } from 'ngx-restangular';
import { ApiURLMap } from '../../../constants/api-urls';


@Injectable()
export class FeedbackFormService {
  constructor(private restangular: Restangular) {
  }

  getFeedBackEventDetails(feedback_form_id): Observable<any> {
    return this.restangular.one(ApiURLMap.feedback_event_details.replace(':id', feedback_form_id)).get();
  }

  toFormGroup(question_data): FormGroup {
    let skills;
    let group: any = {};
    Object.keys(question_data).forEach(categoryId => {
      skills = question_data[categoryId].Skills;
      Object.keys(skills).forEach(skillId => {
        skills[skillId].Questions.forEach(question => {
          group[question.ID] = question.required ? new FormControl(question.value || '', Validators.required)
              : new FormControl(question.value || '');
          group['comment_' + question.ID] = new FormControl('');
        });
      });
    });
    return new FormGroup(group);
  }
}
