import { Injectable } from '@angular/core';
import { ApiService } from '../../core/api/api.service';
import { Observable } from 'rxjs/Observable';
import { FormControl, FormGroup, Validators } from '@angular/forms';


@Injectable()
export class FeedbackFormService {
  constructor(private apiService: ApiService) {
  }

  getFeedBackEventDetails(feedback_form_id): Observable<any> {
    return this.apiService.apiGET('feedback_event_details',
      {}, {'id': feedback_form_id});
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
