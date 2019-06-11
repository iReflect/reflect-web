import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { AUTH_TYPE_CONFIG, DUMMY_HIDDEN_VALUE } from '@constants/app-constants';

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

    public selectedAuthType = '';
    public supportedAuthTypeConfigList: any = [];
    public authTypeConfig = AUTH_TYPE_CONFIG;
    public authTypeConfigList = [AUTH_TYPE_CONFIG.BASIC_AUTH, AUTH_TYPE_CONFIG.API_TOKEN];

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
        if (selectedValue === AUTH_TYPE_CONFIG.API_TOKEN.type) {
            fieldsGroup['apiToken'] = new FormControl(
                this.isUpdateMode ? this.taskProviderAuthData['apiToken'] : '',
                Validators.required
            );
        } else if (selectedValue === AUTH_TYPE_CONFIG.BASIC_AUTH.type) {
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
