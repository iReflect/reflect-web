import { Component, OnInit } from '@angular/core';
import { FeedbackFormService } from './feedback-form.service';
import { ActivatedRoute } from '@angular/router';
import {FormControl, FormGroup} from '@angular/forms';
import {
  BOOLEAN_TYPE_QUESTION, ERRORS, GRADE_TYPE_QUESTION,
  MULTIPLE_CHOICE_TYPE_QUESTION
} from '../../../constants/app-constants';
import { Restangular } from 'ngx-restangular';
import { ApiURLMap } from '../../../constants/api-urls';

@Component({
  selector: 'app-feedback-form',
  templateUrl: './feedback-form.component.html',
  styleUrls: ['./feedback-form.component.scss']
})
export class FeedbackFormComponent implements OnInit {

  isDataLoaded = false;
  dateFormat: 'MMMM dd, yyyy';
  multipleChoiceType = MULTIPLE_CHOICE_TYPE_QUESTION;
  gradeType = GRADE_TYPE_QUESTION;
  booleanType = BOOLEAN_TYPE_QUESTION;
  form: FormGroup;
  feedback_event_data: any;
  selectedNav: number;
  feedbackFormID;
  constructor (private feedBackFormService: FeedbackFormService, private activatedRoute: ActivatedRoute) {
  }

  getFeedBackEvent() {
    this.activatedRoute.params.subscribe(
      params => {
        this.feedbackFormID = params['id'];
        this.feedBackFormService.getFeedBackEventDetails(this.feedbackFormID).subscribe(
          data => {
            this.feedback_event_data = data;
            let categoryIDList = Object.keys(data['Categories']);
            this.selectedNav = parseInt(categoryIDList.length > 0 ? categoryIDList[0] : '0', 10);
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

  showHideNav(categoryID) {
    this.selectedNav = categoryID;
  }

  getRequiredErrorMessage(questionControl: FormControl) {
    if (questionControl.touched && questionControl.errors && questionControl.errors.required) {
      return ERRORS.questionResponseRequired;
    }
  }

  onSubmit(saveAsDraft = false) {
    this.feedBackFormService.postData(this.feedbackFormID, {'data': this.form.value, 'saveAsDraft': saveAsDraft});
  }
}
