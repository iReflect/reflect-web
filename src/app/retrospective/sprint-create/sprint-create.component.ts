import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { API_RESPONSE_MESSAGES, SNACKBAR_DURATION } from '../../../constants/app-constants';
import { RetrospectiveService } from '../../shared/services/retrospective.service';
import { UtilsService } from '../../shared/utils/utils.service';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';

@Component({
    selector: 'app-sprint-create',
    templateUrl: './sprint-create.component.html',
    styleUrls: ['./sprint-create.component.scss'],
})
export class SprintCreateComponent implements OnInit, OnDestroy {
    disableButton = false;
    sprintFormGroup: FormGroup;
    errors: any = {};
    private destroy$: Subject<boolean> = new Subject<boolean>();

    constructor(
        private retrospectiveService: RetrospectiveService,
        private snackBar: MatSnackBar,
        private utils: UtilsService,
        public dialogRef: MatDialogRef<SprintCreateComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
    }

    ngOnInit() {
        this.createSprintFormGroup();
    }

    ngOnDestroy() {
        this.destroy$.next(true);
        this.destroy$.complete();
        if (this.dialogRef) {
            this.dialogRef.close();
        }
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

    clearValue(control) {
        control.setValue(undefined);
    }

    createSprintFormGroup() {
        this.sprintFormGroup = new FormGroup({
            'title': new FormControl('', Validators.required),
            'startDate': new FormControl(''),
            'endDate': new FormControl(''),
            'sprintID': new FormControl(''),
        }, this.validateForm.bind(this));
    }

    validateForm(sprintFormGroup: FormGroup) {
        this.errors = {};
        const sprintFormValue = sprintFormGroup.value;

        const endDateControl = sprintFormGroup.get('endDate');
        const startDateControl = sprintFormGroup.get('startDate');

        if (sprintFormValue.startDate && !sprintFormValue.endDate) {
            if (endDateControl.untouched) {
                // Errors are not visible if the form control is untouched
                endDateControl.markAsTouched();
            }
            endDateControl.setErrors({endDateShouldExist: true});
        } else if (!sprintFormValue.startDate && sprintFormValue.endDate) {
            if (startDateControl.untouched) {
                // Errors are not visible if the form control is untouched
                startDateControl.markAsTouched();
            }
            startDateControl.setErrors({startDateShouldExist: true});
        } else {
            endDateControl.setErrors(null);
            startDateControl.setErrors(null);
        }

        if (sprintFormValue.startDate && sprintFormValue.endDate && sprintFormValue.startDate > sprintFormValue.endDate) {
            this.errors.startGreaterThanEnd = true;
        }

        if (!sprintFormValue.title) {
            this.errors.titleRequired = true;
        } else if (!sprintFormValue.startDate && !sprintFormValue.endDate && !sprintFormValue.sprintID) {
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
        this.retrospectiveService.createSprint(this.data.retrospectiveID, sprintDetails)
            .takeUntil(this.destroy$)
            .subscribe(
                () => {
                    this.snackBar.open(
                        API_RESPONSE_MESSAGES.sprintCreated,
                        '', {duration: SNACKBAR_DURATION});
                    this.dialogRef.close(true);
                    this.disableButton = false;
                },
                err => {
                    this.snackBar.open(
                        this.utils.getApiErrorMessage(err) || API_RESPONSE_MESSAGES.sprintCreateError,
                        '', {duration: SNACKBAR_DURATION});
                    this.disableButton = false;
                }
            );
    }

    closeDialog(result = false) {
        this.dialogRef.close(result);
    }
}
