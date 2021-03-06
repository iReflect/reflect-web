import { Injectable } from '@angular/core';

@Injectable()
export class RetrospectiveDataService {
    private showAllRetro = false;

    saveShowAllRetroState(state: boolean) {
        this.showAllRetro = state;
    }

    getShowAllRetroState() {
        return this.showAllRetro;
    }

    clearShowAllState() {
        this.showAllRetro = false;
    }
}
