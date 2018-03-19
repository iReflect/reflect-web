import { AfterViewInit, Component, ViewChild, ViewContainerRef } from '@angular/core';
import { ICellEditorParams } from 'ag-grid';
import { ICellEditorAngularComp } from 'ag-grid-angular';
import { MatDatepicker } from '@angular/material';

@Component({
    selector: 'app-date-picker-editor',
    templateUrl: './date-picker-editor.component.html',
    styleUrls: ['./date-picker-editor.component.scss']
})
export class DatePickerEditorComponent implements ICellEditorAngularComp, AfterViewInit {
    params: ICellEditorParams;
    private value: string;
    @ViewChild('picker', {read: MatDatepicker}) picker: MatDatepicker<Date>;

    constructor() { }

    ngAfterViewInit() {
        this.picker.open();
    }

    isPopup(): boolean {
        return false;
    }

    isCancelBeforeStart(): boolean {
        return false;
    }

    isCancelAfterEnd(): boolean {
        return false;
    }

    agInit(params: any): void {
        this.params = params;
        this.value = params.value;
    }

    getValue(): string {
        return this.value;
    }

    onSelectChange(e): void {
        setTimeout(function() {
            this.params.stopEditing();
        }.bind(this));
    }

}
