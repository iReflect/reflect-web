import { AfterViewInit, Component, ViewChild, ViewContainerRef } from '@angular/core';
import { ICellEditorParams } from 'ag-grid';
import { ICellEditorAngularComp } from 'ag-grid-angular';

@Component({
    selector: 'app-select-cell-editor',
    templateUrl: './select-cell-editor.component.html',
    styleUrls: ['./select-cell-editor.component.scss']
})
export class SelectCellEditorComponent implements ICellEditorAngularComp, AfterViewInit {
    value: string;
    values: [ string ];
    labels: [ string ];

    private params: ICellEditorParams;
    private selectedIndex: number;
    @ViewChild('select', {read: ViewContainerRef}) private select;

    constructor() { }

    agInit(params: any): void {
        this.params = params;
        this.values = params.values;
        this.labels = params.labels;
        this.value = params.value;
        this.selectedIndex = this.values.findIndex((item) => {
            return item === params.value;
        });
    }

    ngAfterViewInit() {
        setTimeout(() => {
            this.select.element.nativeElement.focus();
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
