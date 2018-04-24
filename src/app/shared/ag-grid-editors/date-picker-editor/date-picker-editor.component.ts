import { AfterViewInit, Component, OnDestroy, ViewChild, ViewContainerRef } from '@angular/core';
import { MatDatepicker } from '@angular/material';
import { ICellEditorAngularComp } from 'ag-grid-angular';
import * as _ from 'lodash';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';

@Component({
    selector: 'app-date-picker-editor',
    templateUrl: './date-picker-editor.component.html',
    styleUrls: ['./date-picker-editor.component.scss']
})
export class DatePickerEditorComponent implements ICellEditorAngularComp, AfterViewInit, OnDestroy {
    params: any;
    minValue: Date;
    value: Date;

    private destroy$: Subject<boolean> = new Subject<boolean>();

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
        this.picker.closedStream.takeUntil(this.destroy$).subscribe(() => {
            this.params.stopEditing();
        });
    }

    ngOnDestroy() {
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
    }
}
