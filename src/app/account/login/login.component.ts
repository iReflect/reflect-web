import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { APP_ROUTE_URLS } from '../../../constants/app-constants';
import { AuthService } from '../../shared/services/auth.service';
import { UserStoreService } from '../../shared/stores/user.store.service';

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
    state = '';

    constructor(private route: ActivatedRoute,
                private router: Router,
                private authService: AuthService,
                private userStoreService: UserStoreService,
                private fb: FormBuilder) {
        // use FormBuilder to create a form group
        this.authForm = this.fb.group({
            'email': ['', [Validators.required, Validators.email]]
        });
    }

    setReturnUrl() {
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || APP_ROUTE_URLS.forwardSlash;
    }

    setStateUrl() {
        this.authService.login().subscribe(response => this.state = response.data['State']);
    }

    ngOnInit() {
        this.setReturnUrl();
        this.setStateUrl();
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
        let queryParams = {
            code: encodeURIComponent(this.authForm.value.email),
            state: this.state
        };
        this.authService.auth(queryParams).subscribe(
            response => {
                this.userStoreService.updateUserData(response.data);
                this.router.navigateByUrl(APP_ROUTE_URLS.root);
                this.isSubmitting = false;
            },
            error => {
                this.errors = error.data;
                this.isSubmitting = false;
            }
        );
    }
}
