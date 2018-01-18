import { Component, OnInit } from '@angular/core';
import { RetrospectiveService } from '../../shared/services/retrospective.service';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { API_RESPONSE_MESSAGES } from '../../../constants/app-constants';

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

    constructor(private service: RetrospectiveService, private snackBar: MatSnackBar) { }

    taskProviderInitialized(index) {
        return taskProviderFormGroup => {
            if (this.taskProvidersList[index]) {
                (<FormArray>this.retroFormGroup.controls[this.taskProviderKey])
                    .setControl(index, taskProviderFormGroup);
            }
        };
    }

    getConfigOptions() {
        this.teamOptions = this.service.getTeamList()['Teams'] || [];
        this.taskProviderOptions = this.service.getTaskProvidersList()['TaskProviders'] || [];
        this.isDataLoaded = true;
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
        this.getConfigOptions();
        this.createRetroFormGroup();
        this.addTaskProvider();
    }

    createRetro() {
        let response: any;
        response = this.service.createRetro(this.retroFormGroup.value);
        if (response.success) {
            this.snackBar.open(API_RESPONSE_MESSAGES.retroCreated, '', {duration: 2000});
            // TODO: Redirect to retro detail page
        } else {
            this.snackBar.open(API_RESPONSE_MESSAGES.error, '', {duration: 2000});
        }
    }

}
