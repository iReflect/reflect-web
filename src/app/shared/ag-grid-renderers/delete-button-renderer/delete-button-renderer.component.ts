import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid';

@Component({
    selector: 'app-delete-button-renderer',
    templateUrl: './delete-button-renderer.component.html',
    styleUrls: ['./delete-button-renderer.component.scss']
})
export class DeleteButtonRendererComponent implements ICellRendererAngularComp {
    private params: ICellRendererParams;

    agInit(params: any): void {
        this.params = params;
    }

    refresh(): boolean {
        return false;
    }

    onDeleteClicked() {
        this.params.colDef.onCellValueChanged(this.params);
    }
}
