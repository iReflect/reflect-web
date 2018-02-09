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
    styles: any;

    agInit(params: any): void {
        this.params = params;
        this.value = RATING_STATES_LABEL[this.params.value];

        this.styles = {
            width: this.value + '%',
            backgroundColor: '#00A000'
        };

        if (this.value === RATING_STATES_LABEL[RATING_STATES.NOTABLE]) {
            this.styles.backgroundColor = '#0FF000';
        } else if (this.value === RATING_STATES_LABEL[RATING_STATES.GOOD]) {
            this.styles.backgroundColor = '#00A000';
        } else if (this.value === RATING_STATES_LABEL[RATING_STATES.OKAY]) {
            this.styles.backgroundColor = '#ff9900';
        } else if (this.value === RATING_STATES_LABEL[RATING_STATES.BAD]) {
            this.styles.backgroundColor = '#ff8';
        } else if (this.value === RATING_STATES_LABEL[RATING_STATES.UGLY]) {
            this.styles.backgroundColor = '#ff3030';
        }
    }

    refresh(params: any): boolean {
        this.params = params;
        this.value = RATING_STATES_LABEL[this.params.value];
        return true;
    }
}
