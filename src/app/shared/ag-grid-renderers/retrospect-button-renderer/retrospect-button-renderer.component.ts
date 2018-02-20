import { Component } from '@angular/core';
import { ICellRendererParams } from 'ag-grid';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
    selector: 'app-retrospect-button-renderer',
    templateUrl: './retrospect-button-renderer.component.html',
    styleUrls: ['./retrospect-button-renderer.component.scss']
})
export class RetrospectButtonRendererComponent implements ICellRendererAngularComp {
    private params: ICellRendererParams;

    agInit(params: any): void {
        this.params = params;
    }

    refresh(): boolean {
        return false;
    }

    onRetrospectClicked() {
        this.params.colDef.onCellValueChanged(this.params);
    }
}
