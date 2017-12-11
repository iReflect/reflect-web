import { Component, OnInit } from '@angular/core';
import { FeedbackFormService } from './feedback-form.service';
import { ActivatedRoute } from '@angular/router';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-feedback-form',
  templateUrl: './feedback-form.component.html',
  styleUrls: ['./feedback-form.component.css']
})
export class FeedbackFormComponent implements OnInit {

  private isDataLoaded = false;
  dateFormat: 'MMMM dd, yyyy';
  form: FormGroup;
  private feedback_event_data: any;
  constructor (private feedBackFormService: FeedbackFormService, private activatedRoute: ActivatedRoute) {
  }

  ngOnInit () {
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

  onSubmit() {
    console.log(this.form.value);
  }
}
