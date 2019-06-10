import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { DUMMY_HIDDEN_VALUE } from '@constants/app-constants';

@Component({
    selector: 'app-task-provider-auth',
    templateUrl: './task-provider-auth.component.html',
    styleUrls: ['./task-provider-auth.component.scss']
})
export class TaskProviderAuthComponent implements OnInit, OnChanges {

    @Input() authFormGroup: FormGroup;
    @Input() supportedAuthTypes: any = [];
    @Input() isUpdateMode: boolean;
    @Input() taskProviderAuthData: any;

    selectedAuthType = '';
    supportedAuthTypeConfigList: any = [];

    authTypeConfigList = [
        {
            'type': 'basicAuth',
            'displayName': 'Basic Auth',
        },
        {
            'type': 'apiToken',
            'displayName': 'API Token',
        }
    ];

    constructor() {}

    ngOnInit() {
        if (this.isUpdateMode) {
        this.onAuthTypeChange(this.taskProviderAuthData.type);
        this.authFormGroup.patchValue({
            'type': this.taskProviderAuthData.type,
        });
        }
    }
    initializeSupportedAuthTypeConfig(supportedAuthTypes) {
        this.selectedAuthType = '';
        this.supportedAuthTypeConfigList = this.authTypeConfigList.filter(
            authConfig => supportedAuthTypes.indexOf(authConfig.type) !== -1);
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.supportedAuthTypes) {
            this.initializeSupportedAuthTypeConfig(changes.supportedAuthTypes.currentValue || []);
        }
    }

    onAuthTypeChange(selectedValue: any) {
        let fieldsGroup: any;
        fieldsGroup = {};
        this.selectedAuthType = selectedValue;
        if (selectedValue === 'apiToken') {
            fieldsGroup['apiToken'] = new FormControl(
                this.isUpdateMode ? this.taskProviderAuthData['apiToken'] : '',
                Validators.required
            );
        } else if (selectedValue === 'basicAuth') {
            fieldsGroup['username'] = new FormControl(
                this.isUpdateMode ? this.taskProviderAuthData['username'] : '',
                Validators.required
            );
            fieldsGroup['password'] = new FormControl(
                this.isUpdateMode ? this.taskProviderAuthData['password'] : '',
                Validators.required
            );
        }
        this.authFormGroup.setControl('data', new FormGroup(fieldsGroup));
    }

    clearField(name: string) {
        if (this.authFormGroup.get('data').value[name] === DUMMY_HIDDEN_VALUE) {
            this.authFormGroup.get('data').patchValue({[name]: ''});
        }
    }

    addDummyValueToField(name: string) {
        if (this.authFormGroup.get('data').value[name] === '') {
            this.authFormGroup.get('data').patchValue({[name]: DUMMY_HIDDEN_VALUE});
        }
    }
}
