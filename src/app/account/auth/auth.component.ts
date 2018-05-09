import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/takeUntil';

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
        window.opener.postMessage(queryParams, window.opener.location);
        self.close();
    }
}
