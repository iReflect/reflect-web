import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from 'app/shared/services/auth.service';
import { LOGIN_ERROR_MESSAGES, RE_SEND_TIME, APP_ROUTE_URLS } from '@constants/app-constants';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-code',
  templateUrl: './code.component.html',
  styleUrls: ['./code.component.scss']
})
export class CodeComponent implements OnInit {

  public codeFormControl = new FormControl('', [
    Validators.required,
  ]);
  public errorMessage: string;
  public showError = false;
  public timer: number;
  public showTimer = true;
  public reSendTimer: any;
  public disableReSendBtn = false;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.startTimer();
  }

  startTimer() {
    this.timer = this.authService.getEmailAndReSendTime().reSendTime;
    this.showTimer = this.timer === 0 ? false : true;
    this.reSendTimer = setInterval(() => {
      this.timer--;
      if (this.timer <= 0) {
        this.stopTimer(this.reSendTimer);
      }
    }, 1000);
  }

  stopTimer(timer: any) {
    this.showTimer = false;
    clearInterval(timer);
  }

  onSubmit() {
    const recoveryData = {
      'email': this.authService.getEmailAndReSendTime().email,
      'otp': this.codeFormControl.value,
    };
    this.authService.recover(recoveryData).subscribe(
      () => {
        this.authService.setOTP(recoveryData.otp);
        this.router.navigate([APP_ROUTE_URLS.updatePassword]);
      },
      (errorResponse: any) => {
        this.errorMessage = errorResponse.data.error;
        this.showError = true;
      }
    );
  }

  sendOTP() {
    this.disableReSendBtn = true;
    const identifyData = {
      'email': this.authService.getEmailAndReSendTime().email,
      'sendOTP': true,
    };
    this.authService.identify(identifyData)
    .pipe(finalize(() => {this.disableReSendBtn = false; }))
    .subscribe(() => {
      this.startTimer();
    },
      (errorResponse: any) => {
        if (errorResponse.status === 400) {
          this.errorMessage = errorResponse.data.error;
        } else {
          this.errorMessage = LOGIN_ERROR_MESSAGES.internalError;
        }
        this.showError = true;
      });
  }
}
