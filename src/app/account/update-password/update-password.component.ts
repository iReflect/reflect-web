import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { APP_ROUTE_URLS, LOGIN_ERROR_MESSAGES } from '@constants/app-constants';
import { AuthService } from 'app/shared/services/auth.service';

@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.scss']
})
export class UpdatePasswordComponent {

  public passwordGroup = new FormGroup({
    firstPassword: new FormControl('', [Validators.required, Validators.minLength(8)]),
    secondPassword: new FormControl('', [Validators.required, Validators.minLength(8)])
  }, {
      validators: this.isPasswordSame
    });
  public hideFirstPassword = true;
  public hideSecondPassword = true;
  public errorMessage: string;
  public showError = false;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) { }

  isPasswordSame(formGroup: FormGroup) {
    const firstPassword = formGroup.get('firstPassword').value;
    const secondPassword = formGroup.get('secondPassword').value;
    return firstPassword === secondPassword ? null : { notSame: true };
  }

  get password() {
    return this.passwordGroup.get('firstPassword');
  }

  onSubmit() {
    const password = this.authService.encryptPassword(this.passwordGroup.get('firstPassword').value);
    const updatePasswordData = {
      'email': this.authService.getEmailAndReSendTime().email,
      'otp': this.authService.getOTP(),
      'password': password,
    };
    this.authService.updatePassword(updatePasswordData)
      .subscribe(() => {
        this.router.navigate([APP_ROUTE_URLS.login]);
      },
        (errorResponse: any) => {
          if (errorResponse.status === 400) {
            this.errorMessage = errorResponse.data.error;
          } else {
            this.errorMessage = LOGIN_ERROR_MESSAGES.internalError;
          }
          this.showError = true;
        }
      );
  }
}
