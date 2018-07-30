import { Component } from '@angular/core';

import { UserStoreService } from './shared/stores/user.store.service';
import { IsMaintenanceModeActiveGuard } from './core/route-guards/is-maintenance-mode-active.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    userLoggedIn = false;

    constructor(private userStoreService: UserStoreService) {

        this.userStoreService.token$.subscribe(
            token => this.userLoggedIn = Boolean(token)
        );
    }

    isAppLoadedAndUserLoggedIn() {
        return this.userLoggedIn && !IsMaintenanceModeActiveGuard.isAppUnderMaintenance;
    }
}
