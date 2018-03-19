import { AfterViewInit, Component, ViewChild, ViewContainerRef } from '@angular/core';
import { ICellEditorParams } from 'ag-grid';
import { ICellEditorAngularComp } from 'ag-grid-angular';
import { MatDatepicker, MatSnackBar } from '@angular/material';
import { API_RESPONSE_MESSAGES, SNACKBAR_DURATION } from '../../../../constants/app-constants';

@Component({
    selector: 'app-date-picker-editor',
    templateUrl: './date-picker-editor.component.html',
    styleUrls: ['./date-picker-editor.component.scss']
})
export class DatePickerEditorComponent implements ICellEditorAngularComp, AfterViewInit {
    params: ICellEditorParams;
    value: Date;
    @ViewChild('picker', {read: MatDatepicker}) picker: MatDatepicker<Date>;

    constructor(private snackBar: MatSnackBar) { }

    ngAfterViewInit() {
    }

    isPopup(): boolean {
        return true;
    }

    isCancelBeforeStart(): boolean {
        return false;
    }

    isCancelAfterEnd(): boolean {
        if (this.value == null) {
            this.snackBar.open(API_RESPONSE_MESSAGES.dateNullError, '', {duration: SNACKBAR_DURATION});
            return true;
        }
        return false;
    }

    agInit(params: any): void {
        this.params = params;
        this.value = params.value;
        console.log(params.value);
    }

    getValue() {
        return this.value;
    }

    onSelectChange(e): void {
    }
}
