import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import * as _ from 'lodash';

function startValidator(control: FormControl) {
    return {
        error: {
            valid: true
        }
    }
}

@Component({
  selector: 'app-sprint-create',
  templateUrl: './sprint-create.component.html',
  styleUrls: ['./sprint-create.component.scss']
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

    get title() {
        return this.sprintFormGroup.get('title');
    }

    get startDate() {
        return this.sprintFormGroup.get('startDate');
    }

    get endDate() {
        return this.sprintFormGroup.get('endDate');
    }

    validateForm(group: FormGroup) {
        this.errors = {};
        const formValue = group.value;

        if (formValue.startDate && !formValue.endDate) {
            this.errors.endShouldExist = true;
        }
        if (!formValue.startDate && formValue.endDate) {
            this.errors.startShouldExist = true;
        }
        if (formValue.startDate && formValue.endDate && formValue.startDate > formValue.endDate) {
            this.errors.startGreaterThanEnd = true;
        }

        if (!formValue.title) {
            this.errors.titleRequired = true;
        } else if (!formValue.startDate && !formValue.endDate && !formValue.sprintId && !group.controls.startDate.invalid && !group.controls.endDate.invalid) {
            this.errors.atleastOne = true;
        }

        if ((!formValue.startDate && !formValue.endDate && formValue.sprintId) || (formValue.startDate && formValue.endDate && formValue.startDate < formValue.endDate)) {
            return null;
        }
        console.log(this.errors);
        return this.errors;
    }

}
