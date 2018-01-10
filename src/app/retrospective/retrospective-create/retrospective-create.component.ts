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

    // Since we are dynamically generating the task provider's form, these are the possible fields
    selectedTaskProviderFields: any = {};

    // Keys used for form controls and provider lookups
    taskProviderKey = 'taskProvider';
    taskProviderConfigKey = 'taskProviderConfig';
    selectedTaskProviderKey = 'selectedTaskProvider';

    constructor(private service: RetrospectiveService, private snackBar: MatSnackBar) { }

    // If we want to add a new task provider, then this method would be helpful
    createNewTaskProviderControl(): FormGroup {
        return new FormGroup({
            [this.selectedTaskProviderKey]: new FormControl('', Validators.required),
            [this.taskProviderConfigKey]: new FormGroup({})
        });
    }

    getConfigOptions() {
        this.teamOptions = this.service.getTeamList()['Teams'] || [];
        this.taskProviderOptions = this.service.getTaskProvidersList()['TaskProviders'] || [];
        this.retroFormGroup = new FormGroup({
            'team': new FormControl('', Validators.required),
            'hoursPerSprint': new FormControl('', Validators.required),
            [this.taskProviderKey]: new FormArray([this.createNewTaskProviderControl()]),
        });
        this.isDataLoaded = true;
    }

    ngOnInit() {
        this.getConfigOptions();
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

    onProviderChange(providerType: string, index: any) {
        return selectedProvider => {
            let fieldsGroup: any, formArrayControl: FormGroup;
            fieldsGroup = {};
            if (providerType === this.taskProviderKey) {
                this.selectedTaskProviderFields[index] = this.taskProviderOptions.filter(
                    provider => provider.Type === selectedProvider)[0]['Fields'];

                this.selectedTaskProviderFields[index].forEach(field => {
                    fieldsGroup[field.FieldName] = new FormControl('',
                        field.Required ? Validators.required : null);
                });
                formArrayControl = <FormGroup>(<FormArray>(this.retroFormGroup.controls[this.taskProviderKey])).controls[index];
                formArrayControl.setControl(this.taskProviderConfigKey, new FormGroup(fieldsGroup, Validators.required));
            }
        };
    }
}
