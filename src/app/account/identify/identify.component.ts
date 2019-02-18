import { Component } from '@angular/core';
import { Validators, FormControl } from '@angular/forms';

import { LOGIN_ERROR_MESSAGES } from '@constants/app-constants';

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

  constructor(private authService: AuthService) {}

  onSubmit(sendOTP: boolean) {
    const identifyData = {
      'email': this.emailFormControl.value,
      'sendOTP': sendOTP,
    };
    this.authService.identify(identifyData).subscribe(() => {}
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
