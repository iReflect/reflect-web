import { AfterViewInit, Component, ViewChild, ViewContainerRef } from '@angular/core';
import { ICellEditorAngularComp } from 'ag-grid-angular';
import { ICellEditorParams } from 'ag-grid';
import { RATING_STATES_LABEL } from '../../../../constants/app-constants';

@Component({
  selector: 'app-rating-editor',
  templateUrl: './rating-editor.component.html',
  styleUrls: ['./rating-editor.component.scss']
})
export class RatingEditorComponent implements ICellEditorAngularComp, AfterViewInit {
    value: string;
    values: [ string ];
    ratingStatesLabel = RATING_STATES_LABEL;

    private params: ICellEditorParams;
    private selectedIndex: number;
    @ViewChild('group', {read: ViewContainerRef}) public group;

    constructor() { }

    agInit(params: any): void {
        this.params = params;
        this.values = params.values;
        this.value = this.params.value;
        this.selectedIndex = this.values.findIndex((item) => {
            return item === this.params.value;
        });
    }

    ngAfterViewInit() {
        setTimeout(() => {
            this.group.element.nativeElement.focus();
        });
        this.selectBasedOnSelectedIndex();
    }

    private selectBasedOnSelectedIndex() {
        this.value = this.values[this.selectedIndex];
    }

    isPopup(): boolean {
        return true;
    }

    isCancelBeforeStart(): boolean {
        return false;
    }

    isCancelAfterEnd(): boolean {
        return false;
    }

    getValue(): string {
        return this.value;
    }

    onSelectChange(e): void {
        this.params.stopEditing();
    }
}
