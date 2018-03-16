import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

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

    refresh(): boolean {
        return false;
    }

    onButtonClicked() {
        this.params.onClick(this.params.data);
    }
}
