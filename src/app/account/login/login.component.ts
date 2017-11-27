import {Component, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ApiService } from '../../core/api/api.service';
import { UserDataStoreService } from '../../shared/data-stores/user-data-store.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  title: String = 'Sign in';
  errors: any;
  isSubmitting = false;
  authForm: FormGroup;
  returnUrl: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private userData: UserDataStoreService,
    private fb: FormBuilder
  ) {
    // use FormBuilder to create a form group
    this.authForm = this.fb.group({
      'email': ['', [Validators.required, Validators.email]],
      'password': ['', Validators.required]
    });
  }

  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  submitForm() {
    this.isSubmitting = true;
    this.errors = {};

    const credentials = this.authForm.value;
    this.apiService.apiPOST('login', credentials)
      .subscribe(
        data => {
          this.userData.updateUserMultipleValues(data);
          this.router.navigateByUrl('/');
          this.isSubmitting = false;
        },
        err => {
            this.errors = err;
            this.isSubmitting = false;
        }
      );
  }
}
