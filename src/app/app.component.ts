import { Component } from '@angular/core';

import { UserStoreService } from './shared/stores/user.store.service';
import { IsMaintenanceModeActiveGuard } from './core/route-guards/is-maintenance-mode-active.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    isAppLoadedAndUserLoggedIn = false;

    constructor(private userStoreService: UserStoreService) {
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
