import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { LoginService } from './login.service';
import { UserDataStoreService } from '../../shared/data-stores/user-data-store.service';
import { APP_ROUTE_URLS } from '../../../constants/app-constants';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  title: String = 'Sign in';
  errors: any;
  isSubmitting = false;
  authForm: FormGroup;
  returnUrl = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private loginService: LoginService,
    private userData: UserDataStoreService,
    private fb: FormBuilder
  ) {
    // use FormBuilder to create a form group
    this.authForm = this.fb.group({
      'email': ['', [Validators.required, Validators.email]],
      'password': ['', Validators.required]
    });
  }

  setReturnUrl() {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  ngOnInit() {
    this.setReturnUrl();
  }

  getErrorMessage() {
    let email = this.authForm.get('email');
    return email.hasError('required') ? 'You must enter a value' :
      email.hasError('email') ? 'Not a valid email' :
        '';
  }

  submitForm() {
    this.isSubmitting = true;
    this.errors = {};

    this.loginService.login(this.authForm.value).subscribe(
        data => {
          this.userData.updateUserMultipleValues(data);
          this.router.navigateByUrl(APP_ROUTE_URLS.root);
          this.isSubmitting = false;
        },
        err => {
            this.errors = err;
            this.isSubmitting = false;
        }
      );
  }
}
