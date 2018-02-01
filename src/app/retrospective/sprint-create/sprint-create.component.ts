import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-sprint-create',
  templateUrl: './sprint-create.component.html',
  styleUrls: ['./sprint-create.component.scss'],
})
export class SprintCreateComponent implements OnInit {

    sprintFormGroup: FormGroup;
    errors: any = { };

    constructor(public dialogRef: MatDialogRef<SprintCreateComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any) { }

    ngOnInit() {
        this.createSprintFormGroup();
    }

    createSprintFormGroup() {
        this.sprintFormGroup = new FormGroup({
            'title': new FormControl('', Validators.required),
            'startDate': new FormControl(''),
            'endDate': new FormControl(''),
            'sprintId': new FormControl(''),
        }, this.validateForm.bind(this));
    }

    get titleControl() {
        return this.sprintFormGroup.get('title');
    }

    get startDateControl() {
        return this.sprintFormGroup.get('startDate');
    }

    get endDateControl() {
        return this.sprintFormGroup.get('endDate');
    }

    validateForm(sprintFormGroup: FormGroup) {
        this.errors = {};
        const sprintFormValue = sprintFormGroup.value;

        if (sprintFormValue.startDate && !sprintFormValue.endDate) {
            this.errors.endShouldExist = true;
        }
        if (!sprintFormValue.startDate && sprintFormValue.endDate) {
            this.errors.startShouldExist = true;
        }
        if (sprintFormValue.startDate && sprintFormValue.endDate && sprintFormValue.startDate > sprintFormValue.endDate) {
            this.errors.startGreaterThanEnd = true;
        }

        if (!sprintFormValue.title) {
            this.errors.titleRequired = true;
        } else if (!sprintFormValue.startDate && !sprintFormValue.endDate && !sprintFormValue.sprintId
            && this.startDateControl.valid && this.endDateControl.valid) {
            this.errors.atleastOne = true;
        }

        return this.errors;
    }

}
