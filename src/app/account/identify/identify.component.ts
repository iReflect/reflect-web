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

  constructor(
    private authService: AuthService,
    private router: Router,
    ) {}

  onSubmit(emailOTP: boolean) {
    const identifyData = {
      'email': this.emailFormControl.value,
      'emailOTP': emailOTP,
    };
    this.authService.identify(identifyData).subscribe((response: any) => {
      this.authService.setEmailAndReSendTime(identifyData.email, response.data.reSendTime);
      this.router.navigate([APP_ROUTE_URLS.code]);
    }
    , (errorResponse: any) => {
      this.errorMessage = errorResponse.status === 400 ? errorResponse.data.error : LOGIN_ERROR_MESSAGES.internalError;
    });
  }
}
