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
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    confirmPassword: new FormControl('', [Validators.required, Validators.minLength(8)])
  }, {
      validators: this.isPasswordSame
    });
  public hidePassword = true;
  public hideConfirmPassword = true;
  public errorMessage: string;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) { }

  isPasswordSame(formGroup: FormGroup) {
    const password = formGroup.get('password').value;
    const confirmPassword = formGroup.get('confirmPassword').value;
    return password === confirmPassword ? null : { notSame: true };
  }

  get password() {
    return this.passwordGroup.get('password');
  }

  onSubmit() {
    const password = this.authService.encryptPassword(this.passwordGroup.get('password').value);
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
          this.errorMessage = errorResponse.status === 400 ? errorResponse.data.error : LOGIN_ERROR_MESSAGES.internalError;
        }
      );
  }
}
