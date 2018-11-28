import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/takeUntil';
import { OAUTH_CALLBACK_EVENT_KEY } from '@constants/app-constants';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

    title: String = 'Sign in';

    constructor(
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        const queryParams = {
            code: this.route.snapshot.queryParams['code'] || '',
            state: this.route.snapshot.queryParams['state'] || ''
        };
        if (window.opener) {
            window.opener.dispatchEvent(new CustomEvent(OAUTH_CALLBACK_EVENT_KEY, {detail: queryParams}));
        }
        self.close();
    }
}
