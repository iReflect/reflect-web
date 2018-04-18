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
    color: string;
    private params: any;

    private setComponentParams(params) {
        this.label = params.label;
        this.isIcon = params.useIcon;
        if (this.isIcon) {
            this.icon = params.icon;
            this.color = params.color;
        }
    }

    agInit(params: any): void {
        this.params = params;
        this.setComponentParams(params);
    }

    refresh(params: ICellRendererParams): boolean {
        const cellRendererParams = params.colDef.cellRendererParams;
        const cellParams = _.isFunction(cellRendererParams) ? cellRendererParams(params) : cellRendererParams;
        this.setComponentParams(cellParams);
        this.params = {...params, ...cellParams};
        return true;
    }

    onButtonClicked() {
        this.params.onClick(this.params);
    }
}
