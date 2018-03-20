import { Component, ViewChild } from '@angular/core';
import { ICellEditorParams } from 'ag-grid';
import { ICellEditorAngularComp } from 'ag-grid-angular';
import { MatDatepicker } from '@angular/material';

@Component({
    selector: 'app-date-picker-editor',
    templateUrl: './date-picker-editor.component.html',
    styleUrls: ['./date-picker-editor.component.scss']
})
export class DatePickerEditorComponent implements ICellEditorAngularComp {
    params: ICellEditorParams;
    value: Date;
    @ViewChild('picker', {read: MatDatepicker}) picker: MatDatepicker<Date>;

    constructor() { }

    isPopup(): boolean {
        return true;
    }

    isCancelBeforeStart(): boolean {
        return false;
    }

    isCancelAfterEnd(): boolean {
        // TODO: Show error message if the user tries to set date to null
        return this.value == null;
    }

    agInit(params: any): void {
        this.params = params;
        this.value = params.value;
    }

    getValue() {
        return this.value;
    }

    onSelectChange(e): void {
    }
}
