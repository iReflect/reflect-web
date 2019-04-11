import { Injectable } from '@angular/core';

@Injectable()
export class RetroDataService {
    private showAllRetro = false;

    saveShowAllRetroState(state: boolean) {
        this.showAllRetro = state;
    }

    getShowAllRetroState() {
        return this.showAllRetro;
    }

    clearRetroData() {
        this.showAllRetro = false;
    }
}
