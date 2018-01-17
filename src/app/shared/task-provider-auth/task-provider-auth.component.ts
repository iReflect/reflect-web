import { Component, Input, OnChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-task-provider-auth',
  templateUrl: './task-provider-auth.component.html',
  styleUrls: ['./task-provider-auth.component.scss']
})
export class TaskProviderAuthComponent implements OnChanges {

    @Input() authFormGroup: FormGroup;
    @Input() supportedAuthTypes: any = [];

    selectedAuthType = '';
    supportedAuthTypeConfigList: any = [];

    authTypeConfigList = [
        {   'type': 'basicAuth',
            'displayName': 'Basic Auth',
        },
        {   'type': 'apiToken',
            'displayName': 'API Token',
        }
    ];

    constructor() { }

    initializeSupportedAuthTypeConfig(supportedAuthTypes) {
        this.selectedAuthType = '';
        this.supportedAuthTypeConfigList = this.authTypeConfigList.filter(
            authConfig => supportedAuthTypes.indexOf(authConfig.type) !== -1);
    }

    ngOnChanges(changes) {
        this.initializeSupportedAuthTypeConfig(changes.supportedAuthTypes.currentValue || []);
    }

    onAuthTypeChange(selectedValue: any) {
        let fieldsGroup: any;
        fieldsGroup = {};
        this.selectedAuthType = selectedValue;
        if (selectedValue === 'apiToken') {
            fieldsGroup['apiToken'] = new FormControl('', Validators.required);
        } else if (selectedValue === 'basicAuth') {
            fieldsGroup['username'] = new FormControl('', Validators.required);
            fieldsGroup['password'] = new FormControl('', Validators.required);
        }
        this.authFormGroup.setControl('data', new FormGroup(fieldsGroup));
    }
}
