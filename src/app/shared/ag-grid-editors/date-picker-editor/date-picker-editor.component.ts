import { AfterViewInit, Component, ViewChild, ViewContainerRef } from '@angular/core';
import { MatDatepicker } from '@angular/material';
import { ICellEditorParams } from 'ag-grid';
import { ICellEditorAngularComp } from 'ag-grid-angular';
import * as _ from 'lodash';

@Component({
    selector: 'app-date-picker-editor',
    templateUrl: './date-picker-editor.component.html',
    styleUrls: ['./date-picker-editor.component.scss']
})
export class DatePickerEditorComponent implements ICellEditorAngularComp, AfterViewInit {
    params: any;
    minValue: Date;
    value: Date;
    @ViewChild('input', {read: ViewContainerRef}) private input;
    @ViewChild('picker', {read: MatDatepicker}) private picker;

    constructor() {
    }

    isPopup(): boolean {
        return true;
    }

    isCancelBeforeStart(): boolean {
        return false;
    }

    isCancelAfterEnd(): boolean {
        // TODO: Show error message if the user tries to set date to null
        return _.isNull(this.value);
    }

    agInit(params: any): void {
        this.params = params;
        this.minValue = params.minValue;
        this.value = params.value;
    }

    getValue() {
        return this.value;
    }

    ngAfterViewInit() {
        setTimeout(() => {
            this.input.element.nativeElement.click();
            Array.from(document.getElementsByClassName('mat-datepicker-popup')).forEach(element => {
                element.addEventListener('click', ($event) => {
                    $event.preventDefault();
                    $event.stopPropagation();
                });
            });
        });
        this.picker.closedStream.subscribe(() => {
            this.params.stopEditing();
        });
    }
}
