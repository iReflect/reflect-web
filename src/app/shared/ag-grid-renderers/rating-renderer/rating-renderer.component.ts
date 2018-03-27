import { Component } from '@angular/core';
import { AgRendererComponent } from 'ag-grid-angular';
import { RATING_COLORS, RATING_STATES_LABEL } from '../../../../constants/app-constants';
import { ICellRendererParams } from 'ag-grid';

@Component({
    selector: 'app-rating-renderer',
    templateUrl: './rating-renderer.component.html',
    styleUrls: ['./rating-renderer.component.scss']
})
export class RatingRendererComponent implements AgRendererComponent {
    value: any;
    ratingColors = RATING_COLORS;
    private params: ICellRendererParams;

    getColor() {
        return this.ratingColors[this.value];
    }

    agInit(params: any): void {
        this.params = params;
        this.value = RATING_STATES_LABEL[this.params.value];
    }

    refresh(params: any): boolean {
        this.params = params;
        this.value = RATING_STATES_LABEL[this.params.value];
        return true;
    }
}
