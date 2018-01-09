import { Component, OnInit } from '@angular/core';
import { RetrospectiveService } from '../../shared/services/retrospective.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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

    // These are the possible options for the teams, time and task providers
    teamOptions: any = [];
    taskProviderOptions: any = [];
    timeProviderOptions: any = [];

    // Since we are dynamically generating the time and task provider's form, these are the possible fields
    selectedTimeProviderFields: any = [];
    selectedTaskProviderFields: any = [];

    // Keys used for form controls and provider lookups
    timeProviderKey = 'timeProvider';
    taskProviderKey = 'taskProvider';

    constructor(private service: RetrospectiveService, private snackBar: MatSnackBar) { }

    getConfigOptions() {
        let configOptions: any;
        configOptions = this.service.getRetroConfigOptions();
        this.teamOptions = configOptions['Teams'] || [];
        this.taskProviderOptions = configOptions['TaskProviders'] || [];
        this.timeProviderOptions = configOptions['TimeProviders'] || [];
        this.retroFormGroup = new FormGroup({
            'team': new FormControl('', Validators.required),
            'selectedTimeProvider': new FormControl('', Validators.required),
            'selectedTaskProvider': new FormControl('', Validators.required),
            [this.timeProviderKey]: new FormGroup({}),
            [this.taskProviderKey]: new FormGroup({}),
        });
        this.isDataLoaded = true;
    }

    ngOnInit() {
        this.getConfigOptions();
    }

    createRetro() {
        let retroConfig, response: any;
        retroConfig = this.retroFormGroup.value;
        response = this.service.createRetro({
            'team': retroConfig['team'],
            [retroConfig['selectedTaskProvider']]: retroConfig[this.taskProviderKey],
            [retroConfig['selectedTimeProvider']]: retroConfig[this.timeProviderKey],
        });
        if (response.success) {
            this.snackBar.open(API_RESPONSE_MESSAGES.retroCreated, '', {duration: 2000});
            // TODO: Redirect to retro detail page
        } else {
            this.snackBar.open(API_RESPONSE_MESSAGES.error, '', {duration: 2000});
        }
    }

    onProviderChange(providerType: string) {
        return selectedProvider => {
            let fieldsGroup, filterProvider, createControlFromField: any;
            fieldsGroup = {};

            // callback for filtering selected provider
            filterProvider = provider => provider.Type === selectedProvider;

            // callback for dynamically generating form controls using providers fields
            createControlFromField = field => {
                fieldsGroup[field.FieldName] = new FormControl('',
                    field.Required ? Validators.required : null);
            };
            if (providerType === this.timeProviderKey) {
                this.selectedTimeProviderFields = this.timeProviderOptions.filter(filterProvider)[0]['Fields'];

                this.selectedTimeProviderFields.forEach(createControlFromField);

                this.retroFormGroup.setControl(this.timeProviderKey, new FormGroup(fieldsGroup, Validators.required));

            } else if (providerType === this.taskProviderKey) {
                this.selectedTaskProviderFields = this.taskProviderOptions.filter(filterProvider)[0]['Fields'];

                this.selectedTaskProviderFields.forEach(createControlFromField);

                this.retroFormGroup.setControl(this.taskProviderKey, new FormGroup(fieldsGroup, Validators.required));
            }
        };
    }
}
