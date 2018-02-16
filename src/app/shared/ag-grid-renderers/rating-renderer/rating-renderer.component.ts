import { Component } from '@angular/core';
import { AgRendererComponent } from 'ag-grid-angular';
import { RATING_COLORS, RATING_STATES_LABEL} from '../../../../constants/app-constants';
import { ICellRendererParams } from 'ag-grid';

@Component({
  selector: 'app-rating-renderer',
  templateUrl: './rating-renderer.component.html',
  styleUrls: ['./rating-renderer.component.scss']
})
export class RatingRendererComponent implements AgRendererComponent {
    private params: ICellRendererParams;
    value: any;
    styles: any = {};
    ratingColors = RATING_COLORS;

    agInit(params: any): void {
        this.params = params;
        this.value = RATING_STATES_LABEL[this.params.value];
        this.styles.backgroundColor = this.ratingColors[this.value];
    }

    refresh(params: any): boolean {
        this.params = params;
        this.value = RATING_STATES_LABEL[this.params.value];
        this.styles.backgroundColor = this.ratingColors[this.value];
        return true;
    }
}
