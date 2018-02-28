import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { API_RESPONSE_MESSAGES, SNACKBAR_DURATION } from '../../../constants/app-constants';
import { RetrospectiveService } from '../../shared/services/retrospective.service';

@Component({
  selector: 'app-sprint-create',
  templateUrl: './sprint-create.component.html',
  styleUrls: ['./sprint-create.component.scss'],
})
export class SprintCreateComponent implements OnInit {
    disableButton = false;
    sprintFormGroup: FormGroup;
    errors: any = {};

    constructor(private retrospectiveService: RetrospectiveService,
                private snackBar: MatSnackBar,
                public dialogRef: MatDialogRef<SprintCreateComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any) { }

    ngOnInit() {
        this.createSprintFormGroup();
    }

    createSprintFormGroup() {
        this.sprintFormGroup = new FormGroup({
            'title': new FormControl('', Validators.required),
            'startDate': new FormControl(''),
            'endDate': new FormControl(''),
            'sprintID': new FormControl(''),
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
            this.errors.endDateShouldExist = true;
        }
        if (!sprintFormValue.startDate && sprintFormValue.endDate) {
            this.errors.startDateShouldExist = true;
        }
        if (sprintFormValue.startDate && sprintFormValue.endDate && sprintFormValue.startDate > sprintFormValue.endDate) {
            this.errors.startGreaterThanEnd = true;
        }
        if (!sprintFormValue.title) {
            this.errors.titleRequired = true;
        } else if (!sprintFormValue.startDate && !sprintFormValue.endDate && !sprintFormValue.sprintID
            && this.startDateControl.valid && this.endDateControl.valid) {
            this.errors.atleastOne = true;
        }
        return this.errors;
    }

    createSprint(sprintDetails) {
        this.disableButton = true;
        if (!sprintDetails.startDate) {
            sprintDetails.startDate = null;
        }
        if (!sprintDetails.endDate) {
            sprintDetails.endDate = null;
        }
        this.retrospectiveService.createSprint(this.data.retrospectiveID, sprintDetails).subscribe(
            () => {
                this.snackBar.open(API_RESPONSE_MESSAGES.sprintCreated, '', {duration: SNACKBAR_DURATION});
                this.dialogRef.close(true);
                this.disableButton = false;
            },
            () => {
                this.snackBar.open(API_RESPONSE_MESSAGES.sprintCreateError, '', {duration: SNACKBAR_DURATION});
                this.disableButton = false;
            }
        );
    }
}
