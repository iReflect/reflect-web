import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
    selector: 'app-basic-modal',
    templateUrl: './basic-modal.component.html',
    styleUrls: ['./basic-modal.component.scss']
})
export class BasicModalComponent {

    constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }
}
