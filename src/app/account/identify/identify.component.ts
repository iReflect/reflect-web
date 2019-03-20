import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { APP_ROUTE_URLS, LOGIN_ERROR_MESSAGES } from '@constants/app-constants';
import { AuthService } from 'app/shared/services/auth.service';

@Component({
  selector: 'app-identify',
  templateUrl: './identify.component.html',
  styleUrls: ['./identify.component.scss']
})
export class IdentifyComponent {

  public emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email
  ]);
  public errorMessage: string;
  public showError = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    ) {}

  onSubmit(sendOTP: boolean) {
    const identifyData = {
      'email': this.emailFormControl.value,
      'sendOTP': sendOTP,
    };
    this.authService.identify(identifyData).subscribe((response: any) => {
      this.authService.setEmailAndReSendTime(identifyData.email, response.data.reSendTime);
      this.router.navigate([APP_ROUTE_URLS.code]);
    }
    , (errorResponse: any) => {
      if (errorResponse.status === 400) {
        this.errorMessage = errorResponse.data.error;
      } else {
        this.errorMessage = LOGIN_ERROR_MESSAGES.internalError;
      }
      this.showError = true;
    });
  }
}
