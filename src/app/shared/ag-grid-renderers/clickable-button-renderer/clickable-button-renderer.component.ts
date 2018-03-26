import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import {ICellRendererParams} from 'ag-grid';
import * as _ from 'lodash';

@Component({
    selector: 'app-clickable-button-renderer',
    templateUrl: './clickable-button-renderer.component.html',
    styleUrls: ['./clickable-button-renderer.component.scss']
})
export class ClickableButtonRendererComponent implements ICellRendererAngularComp {
    label: string;
    isIcon = false;
    icon: string;
    private params: any;

    agInit(params: any): void {
        this.params = params;
        this.label = params.label;
        if (params.useIcon) {
            this.isIcon = true;
            this.icon = params.icon;
        }
    }

    refresh(params: ICellRendererParams): boolean {
        const cellRendererParams = params.colDef.cellRendererParams;
        let cellParams;
        if (_.isFunction(cellRendererParams)) {
            cellParams = cellRendererParams(params);
        } else {
            cellParams = cellRendererParams;
        }
        this.label = cellParams.label;
        this.isIcon = cellParams.useIcon;
        this.icon = cellParams.icon;
        this.params = {...params, ...cellParams};
        return true;
    }

    onButtonClicked() {
        this.params.onClick(this.params);
    }
}
