import { AfterViewInit, Component, ViewChild, ViewContainerRef } from '@angular/core';
import { ICellEditorParams } from 'ag-grid';
import { ICellEditorAngularComp } from 'ag-grid-angular';
import { MatSelect } from '@angular/material';

@Component({
    selector: 'app-select-cell-editor',
    templateUrl: './select-cell-editor.component.html',
    styleUrls: ['./select-cell-editor.component.scss']
})
export class SelectCellEditorComponent implements ICellEditorAngularComp, AfterViewInit {
    value: string;
    selectOptions: any = [];

    private params: ICellEditorParams;
    @ViewChild('container', {read: ViewContainerRef}) private container;
    @ViewChild('select', {read: MatSelect}) private select: MatSelect;

    constructor() {
    }

    agInit(params: any): void {
        this.params = params;
        this.selectOptions = params.selectOptions;
        this.value = params.value;
    }

    ngAfterViewInit() {
        setTimeout(() => {
            this.container.element.nativeElement.focus();
            this.select.open();
        });
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
