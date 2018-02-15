import { Component } from '@angular/core';
import { AgRendererComponent } from 'ag-grid-angular';
import { RATING_STATES, RATING_STATES_LABEL } from '../../../../constants/app-constants';
import { ICellRendererParams } from 'ag-grid';

@Component({
  selector: 'app-rating-renderer',
  templateUrl: './rating-renderer.component.html',
  styleUrls: ['./rating-renderer.component.scss']
})
export class RatingRendererComponent implements AgRendererComponent {
    private params: ICellRendererParams;
    value: any;
    styles: any = { backgroundColor: '#00A000' };
    ratingColor = {
        [RATING_STATES_LABEL[RATING_STATES.NOTABLE]]: '#0FF000',
        [RATING_STATES_LABEL[RATING_STATES.GOOD]]: '#00A000',
        [RATING_STATES_LABEL[RATING_STATES.OKAY]]: '#ff9900',
        [RATING_STATES_LABEL[RATING_STATES.BAD]]: '#ff8',
        [RATING_STATES_LABEL[RATING_STATES.UGLY]]: '#ff3030'
    };

    agInit(params: any): void {
        this.params = params;
        this.value = RATING_STATES_LABEL[this.params.value];
        this.styles.backgroundColor = this.ratingColor[this.value];
    }

    refresh(params: any): boolean {
        this.params = params;
        this.value = RATING_STATES_LABEL[this.params.value];
        this.styles.backgroundColor = this.ratingColor[this.value];
        return true;
    }
}
