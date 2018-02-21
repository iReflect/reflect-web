import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MatSnackBar } from '@angular/material';
import { RetrospectiveService } from "../../shared/services/retrospective.service";
import { API_RESPONSE_MESSAGES, SNACKBAR_DURATION } from "../../../constants/app-constants";

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

    constructor(private retrospectiveService: RetrospectiveService,
                private snackBar: MatSnackBar,
                public dialogRef: MatDialogRef<RetrospectiveCreateComponent>) {
    }

    ngOnInit() {
        this.getTeamList();
        this.getTaskProviders();
        this.createRetroFormGroup();
        this.addTaskProvider();
    }

    getTeamList() {
        this.retrospectiveService.getTeamList().subscribe(
            response => {
                this.teamOptions = response.data.Teams;
                console.log(this.teamOptions);
                if (this.taskProviderOptions) {
                    this.isDataLoaded = true;
                }
            },
            () => {
                this.snackBar.open(API_RESPONSE_MESSAGES.getTeamListError, '', {duration: SNACKBAR_DURATION});
                this.dialogRef.close();
            }
        );
    }

    getTaskProviders() {
        this.retrospectiveService.getTaskProvidersList().subscribe(
            response => {
                this.taskProviderOptions = response.data.TaskProviders;
                console.log(this.taskProviderOptions);
                if (this.teamOptions) {
                    this.isDataLoaded = true;
                }
            },
            () => {
                this.snackBar.open(API_RESPONSE_MESSAGES.getTeamProviderOptionsError, '', {duration: SNACKBAR_DURATION});
                this.dialogRef.close();
            }
        );
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
}
