import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
    selector: 'app-retrospective-create',
    templateUrl: './retrospective-create.component.html',
    styleUrls: ['./retrospective-create.component.scss']
})
export class RetrospectiveCreateComponent implements OnInit {

    retroFormGroup: FormGroup;
    isDataLoaded = false;

    // These are the possible options for the teams and task providers
    teamOptions: any = [];
    taskProviderOptions: any = [];

    // It is used to render the task provider components (When we add a task provider,
    // a new entry will be made in this list with a true value (as of now))
    taskProvidersList: any = [];
    // Maintains the task providers count
    taskProvidersIndex = -1;

    // Keys used for form controls and provider lookups
    taskProviderKey = 'taskProvider';

    constructor(public dialogRef: MatDialogRef<RetrospectiveCreateComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any) {
        this.isDataLoaded = data.isDataLoaded;
        this.teamOptions = data.teamOptions;
        this.taskProviderOptions = data.taskProviderOptions;
    }

    taskProviderInitialized(index) {
        return taskProviderFormGroup => {
            if (this.taskProvidersList[index]) {
                (<FormArray>this.retroFormGroup.controls[this.taskProviderKey])
                    .setControl(index, taskProviderFormGroup);
            }
        };
    }

    createRetroFormGroup() {
        this.retroFormGroup = new FormGroup({
            'title': new FormControl('', Validators.required),
            'team': new FormControl('', Validators.required),
            'hoursPerStoryPoint': new FormControl('', Validators.required),
            'projectName': new FormControl('', Validators.required),
        });
    }

    addTaskProvider() {
        if (!this.retroFormGroup.contains(this.taskProviderKey)) {
            this.retroFormGroup.addControl(this.taskProviderKey, new FormArray([]));
        }
        (<FormArray>this.retroFormGroup.controls[this.taskProviderKey]).push(new FormGroup({}));
        this.taskProvidersList[++this.taskProvidersIndex] = true;
    }

    ngOnInit() {
        this.createRetroFormGroup();
        this.addTaskProvider();
    }

}
