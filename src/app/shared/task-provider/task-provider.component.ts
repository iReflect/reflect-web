import {ENTER, COMMA} from '@angular/cdk/keycodes';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material';

import { TRACKER_TICKET_TYPE_MAP, COMMA_SEPARATED_STRING_PATTERN, TRACKER_TICKET_STATUS_MAP } from '@constants/app-constants';

@Component({
    selector: 'app-task-provider',
    templateUrl: './task-provider.component.html',
    styleUrls: ['./task-provider.component.scss']
})
export class TaskProviderComponent implements OnInit {

    @Input() taskProviderOptions: any = [];
    @Input() isUpdateMode: boolean;
    @Input() retrospectiveData: any;
    @Output() initializedTaskProvider = new EventEmitter<FormGroup>();
    @Output() onProviderChanged = new EventEmitter<string>();

    taskProviderData: any;
    taskProviderAuthData: any;
    taskProviderConfigKey = 'taskProviderConfig';
    selectedTaskProviderKey = 'selectedTaskProvider';
    taskProviderFormGroup: FormGroup;
    isInitialized = false;
    showConfigFields = false;
    trackerTicketTypeMap = TRACKER_TICKET_TYPE_MAP;
    trackerTicketStatusMap = TRACKER_TICKET_STATUS_MAP;
    commaSeparatedRegex = COMMA_SEPARATED_STRING_PATTERN;
    public doneValues = [];
    public featureValues = [];
    public taskValues = [];
    public bugValues = [];
    // Enter, comma
    separatorKeysCodes = [ENTER, COMMA];
    // Since we are dynamically generating the task provider's form, these are the possible fields
    selectedTaskProviderConfigOptions: any = {};

    constructor() {
    }

    ngOnInit() {
        this.initializeTaskProvider();
        if (this.isUpdateMode) {
            this.setTaskProviderData();
        }
    }

    initializeTaskProvider() {
        if (!this.taskProviderFormGroup) {
            this.taskProviderFormGroup = new FormGroup({
                [this.selectedTaskProviderKey]: new FormControl('', Validators.required),
                [this.taskProviderConfigKey]: new FormGroup({}),
                'Credentials': new FormGroup({}),
            });
            this.initializedTaskProvider.emit(this.taskProviderFormGroup);
            this.isInitialized = true;
        }
    }

    setTaskProviderData() {
        this.taskProviderData = this.retrospectiveData.TaskProviderConfig[0];
        this.taskProviderAuthData = this.taskProviderData.data.credentials || {};
        this.taskProviderFormGroup.patchValue({
            [this.selectedTaskProviderKey]: this.taskProviderData.type,
        });
        this.onProviderChange(this.taskProviderData.type);
    }

    onProviderChange(selectedProvider) {
        this.onProviderChanged.emit(selectedProvider);
        let configFieldsGroup: any, credentialFieldsGroup: any, selectedTaskProvider: any;
        configFieldsGroup = {};
        selectedTaskProvider = this.taskProviderOptions.filter(provider => provider.Type === selectedProvider)[0];

        this.showConfigFields = false;

        selectedTaskProvider['Fields'].forEach(field => {
            configFieldsGroup[field.FieldName] = new FormControl({
                value: this.isUpdateMode ? this.taskProviderData.data[field.FieldName] : '',
                disabled: !field.Editable && this.isUpdateMode
            },
            field.Required ? Validators.required : null);
        });

        const ticketTypeMappingGroup = {
            [TRACKER_TICKET_TYPE_MAP.FEATURE]: new FormControl(
                this.isUpdateMode ? this.taskProviderData.data[TRACKER_TICKET_TYPE_MAP.FEATURE] : '',
                Validators.required
            ),
            [TRACKER_TICKET_TYPE_MAP.TASK]: new FormControl(
                this.isUpdateMode ? this.taskProviderData.data[TRACKER_TICKET_TYPE_MAP.TASK] : '',
                Validators.required
            ),
            [TRACKER_TICKET_TYPE_MAP.BUG]: new FormControl(
                this.isUpdateMode ? this.taskProviderData.data[TRACKER_TICKET_TYPE_MAP.BUG] : '',
                Validators.required
            )
        };

        const ticketStatusMappingGroup = {
            [TRACKER_TICKET_STATUS_MAP.DONE]: new FormControl(
                this.isUpdateMode ? this.taskProviderData.data[TRACKER_TICKET_STATUS_MAP.DONE] : '',
                Validators.required
            )
        };
        // Assigning value to the Chips.
        if (this.isUpdateMode) {
            this.doneValues = this.taskProviderData.data[TRACKER_TICKET_STATUS_MAP.DONE].split(',');
            this.featureValues = this.taskProviderData.data[TRACKER_TICKET_TYPE_MAP.FEATURE].split(',');
            this.taskValues = this.taskProviderData.data[TRACKER_TICKET_TYPE_MAP.TASK].split(',');
            this.bugValues = this.taskProviderData.data[TRACKER_TICKET_TYPE_MAP.BUG].split(',');
        }

        configFieldsGroup = {...configFieldsGroup, ...ticketTypeMappingGroup, ...ticketStatusMappingGroup};

        this.taskProviderFormGroup.setControl(this.taskProviderConfigKey,
            new FormGroup(configFieldsGroup, Validators.required));

        credentialFieldsGroup = {
            'type': new FormControl({value: '', disabled: this.isUpdateMode}, Validators.required),
            'data': new FormGroup({})
        };
        this.taskProviderFormGroup.setControl('Credentials',
            new FormGroup(credentialFieldsGroup));

        this.selectedTaskProviderConfigOptions = {
            'fields': selectedTaskProvider['Fields'],
            'supportedAuthTypes': selectedTaskProvider['SupportedAuthTypes']
        };
        this.showConfigFields = true;
    }

    get featureTypeControl() {
        return this.taskProviderFormGroup.get([this.taskProviderConfigKey, TRACKER_TICKET_TYPE_MAP.FEATURE]);
    }

    get taskTypeControl() {
        return this.taskProviderFormGroup.get([this.taskProviderConfigKey, TRACKER_TICKET_TYPE_MAP.TASK]);
    }

    get bugTypeControl() {
        return this.taskProviderFormGroup.get([this.taskProviderConfigKey, TRACKER_TICKET_TYPE_MAP.BUG]);
    }
    get doneStatusControl() {
        return this.taskProviderFormGroup.get([this.taskProviderConfigKey, TRACKER_TICKET_STATUS_MAP.DONE]);
    }

    addChip(event: MatChipInputEvent, array: string[], control: any): void {
        const input = event.input;
        const value = event.value;

        // Reset the input value
        if (input) { input.value = ''; }

        if (array.indexOf(value) > -1) {
            return;
        }
        // Add our keyword
        if ((value || '').trim()) {
          array.push(value.trim());
          control.patchValue(array.toString());
        }
    }

    removeChip(keyword: any, array: string[], control: any): void {
        const index = array.indexOf(keyword);
        if (index >= 0) {
            array.splice(index, 1);
            control.patchValue(array.toString());
        }
    }
}
