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
    let group: any = {};

    question_data.forEach(category => {
      category.skills.forEach(skill => {
        skill.questions.forEach(question => {
          group[question.id] = question.required ? new FormControl(question.value || '', Validators.required)
            : new FormControl(question.value || '');
        });
      });
    });
    return new FormGroup(group);
  }
}
