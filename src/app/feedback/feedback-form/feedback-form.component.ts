import { Component, OnInit } from '@angular/core';
import { FeedbackFormService } from './feedback-form.service';
import { ActivatedRoute } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { BOOLEAN_TYPE_QUESTION, GRADE_TYPE_QUESTION,
  MULTIPLE_CHOICE_TYPE_QUESTION } from '../../../constants/app-constants';

@Component({
  selector: 'app-feedback-form',
  templateUrl: './feedback-form.component.html',
  styleUrls: ['./feedback-form.component.scss']
})
export class FeedbackFormComponent implements OnInit {

  private isDataLoaded = false;
  dateFormat: 'MMMM dd, yyyy';
  multipleChoiceType = MULTIPLE_CHOICE_TYPE_QUESTION;
  gradeType = GRADE_TYPE_QUESTION;
  booleanType = BOOLEAN_TYPE_QUESTION;
  form: FormGroup;
  private feedback_event_data: any;
  constructor (private feedBackFormService: FeedbackFormService, private activatedRoute: ActivatedRoute) {
  }

  getFeedBackEvent() {
    this.activatedRoute.params.subscribe(
      params => {
        this.feedBackFormService.getFeedBackEventDetails(params['id']).subscribe(
          data => {
            this.feedback_event_data = data;
            this.isDataLoaded = true;
            this.form = this.feedBackFormService.toFormGroup(data['Categories']);
          }
        );
      }
    );
  }

  ngOnInit () {
    this.getFeedBackEvent();
  }

  onSubmit() {
    console.log(this.form.value);
  }
}
