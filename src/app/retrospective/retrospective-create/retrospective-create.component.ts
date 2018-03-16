import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { RetrospectiveService } from '../../shared/services/retrospective.service';
import { API_RESPONSE_MESSAGES, SNACKBAR_DURATION } from '../../../constants/app-constants';
import * as _ from 'lodash';

@Component({
    selector: 'app-retrospective-create',
    templateUrl: './retrospective-create.component.html',
    styleUrls: ['./retrospective-create.component.scss']
})
export class RetrospectiveCreateComponent implements OnInit {

    retroFormGroup: FormGroup;
    isTeamOptionsLoaded = false;
    isProviderOptionsLoaded = false;
    disableButton = false;

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
                public dialogRef: MatDialogRef<RetrospectiveCreateComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any) { }

    ngOnInit() {
        this.getTeamList();
        this.getTaskProviders();
        this.createRetroFormGroup();
        this.addTaskProvider();
    }

    getTeamList() {
        this.retrospectiveService.getTeamList().subscribe(
            response => {
                if (_.isEmpty(response.data.Teams)) {
                    this.snackBar.open(API_RESPONSE_MESSAGES.noTeamsError, '', {duration: SNACKBAR_DURATION});
                    this.closeDialog();
                } else {
                    this.teamOptions = response.data.Teams;
                    this.isTeamOptionsLoaded = true;
                }
            },
            () => {
                this.snackBar.open(API_RESPONSE_MESSAGES.getTeamListError, '', {duration: SNACKBAR_DURATION});
                this.closeDialog();
            }
        );
    }

    getTaskProviders() {
        this.retrospectiveService.getTaskProvidersList().subscribe(
            response => {
                this.taskProviderOptions = response.data.TaskProviders;
                this.isProviderOptionsLoaded = true;
            },
            () => {
                this.snackBar.open(API_RESPONSE_MESSAGES.getTeamProviderOptionsError, '', {duration: SNACKBAR_DURATION});
                this.closeDialog();
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
            'team': new FormControl('', Validators.required),
            'storyPointPerWeek': new FormControl('', Validators.required),
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

    createRetro(formValue) {
        this.disableButton = true;
        const selectedTeam = this.teamOptions.filter(team => team.ID === formValue.team)[0];
        const requestBody = {
            'title': selectedTeam && selectedTeam.Name || '',
            'team': formValue.team,
            'storyPointPerWeek': formValue.storyPointPerSprint,
            'projectName': formValue.projectName,
            'taskProvider': formValue.taskProvider.map(provider => {
                return {
                    'type': provider.selectedTaskProvider,
                    'data': {
                        ...provider.taskProviderConfig,
                        'credentials': {
                            ...provider.Credentials.data,
                            'type': provider.Credentials.type
                        }
                    }
                };
            })
        };

        this.retrospectiveService.createRetro(requestBody).subscribe(
            () => {
                this.snackBar.open(API_RESPONSE_MESSAGES.retroCreated, '', {duration: SNACKBAR_DURATION});
                this.closeDialog(true);
                this.disableButton = false;
            },
            () => {
                this.snackBar.open(API_RESPONSE_MESSAGES.createRetroError, '', {duration: SNACKBAR_DURATION});
                this.disableButton = false;
            }
        );
    }

    closeDialog(result = false) {
        this.dialogRef.close(result);
    }
}
