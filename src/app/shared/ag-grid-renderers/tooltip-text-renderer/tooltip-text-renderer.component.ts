import { Component } from '@angular/core';
import { ICellRendererParams } from 'ag-grid';
import { AgRendererComponent } from 'ag-grid-angular';

@Component({
    selector: 'app-tooltip-text-renderer',
    templateUrl: './tooltip-text-renderer.component.html',
    styleUrls: ['./tooltip-text-renderer.component.scss']
})
export class TooltipTextRendererComponent implements AgRendererComponent {
    private params: ICellRendererParams;
    private value: any;

    agInit(params: any): void {
        this.params = params;
        this.value = this.params.value;
    }

    refresh(params: any): boolean {
        this.params = params;
        this.value = this.params.value;
        return true;
    }
}
