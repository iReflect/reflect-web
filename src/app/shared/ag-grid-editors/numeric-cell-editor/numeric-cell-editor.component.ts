import { AfterViewInit, Component, ViewChild, ViewContainerRef } from '@angular/core';
import { ICellEditorAngularComp } from 'ag-grid-angular';

@Component({
    selector: 'app-numeric-cell-editor',
    templateUrl: './numeric-cell-editor.component.html',
    styleUrls: ['./numeric-cell-editor.component.scss']
})
export class NumericCellEditorComponent implements ICellEditorAngularComp, AfterViewInit {
    value: number;
    minValue: number;
    maxValue: number;
    params: any;
    @ViewChild('input', {read: ViewContainerRef}) private input;

    agInit(params: any): void {
        this.params = params;
        this.value = params.value ? params.value : 0;
        this.minValue = params.minValue;
        if (params.addCellValueToMax) {
            this.maxValue = params.baseMaxValue + params.value;
        } else {
            this.maxValue = params.maxValue;
        }
    }

    getValue(): any {
        return this.value;
    }

    ngAfterViewInit() {
        setTimeout(() => {
            this.input.element.nativeElement.focus();
        });
    }
}
