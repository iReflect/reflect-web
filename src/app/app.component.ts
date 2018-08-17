import { Component, OnInit } from '@angular/core';

import { IsMaintenanceModeActiveGuard } from './core/route-guards/is-maintenance-mode-active.service';
import { UserStoreService } from './shared/stores/user.store.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    isAppLoadedAndUserLoggedIn = false;

    constructor(private userStoreService: UserStoreService) {
    }

    ngOnInit() {
        this.checkAppLoadedAndUserLoggedIn();
    }

    checkAppLoadedAndUserLoggedIn() {
        this.userStoreService.token$.subscribe(
            token => {
                const userLoggedIn = Boolean(token);
                this.isAppLoadedAndUserLoggedIn = userLoggedIn && !IsMaintenanceModeActiveGuard.isAppUnderMaintenance;
            }
        );
    }
}
