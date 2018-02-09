import { Component } from '@angular/core';
import { AgRendererComponent } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid';

@Component({
  selector: 'app-vacation-renderer',
  templateUrl: './vacation-renderer.component.html',
  styleUrls: ['./vacation-renderer.component.scss']
})
export class VacationRendererComponent implements AgRendererComponent {
    private params: ICellRendererParams;
    private value: any;

    // called on init
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
