import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TRACKER_TICKET_TYPE_MAP, COMMA_SEPARATED_STRING_PATTERN, TRACKER_TICKET_STATUS_MAP } from '@constants/app-constants';

@Component({
    selector: 'app-task-provider',
    templateUrl: './task-provider.component.html',
    styleUrls: ['./task-provider.component.scss']
})
export class TaskProviderComponent implements OnInit {

    @Input() taskProviderOptions: any = [];
    @Output() initializedTaskProvider = new EventEmitter<FormGroup>();

    taskProviderConfigKey = 'taskProviderConfig';
    selectedTaskProviderKey = 'selectedTaskProvider';
    taskProviderFormGroup: FormGroup;
    isInitialized = false;
    showConfigFields = false;
    trackerTicketTypeMap = TRACKER_TICKET_TYPE_MAP;
    trackerTicketStatusMap = TRACKER_TICKET_STATUS_MAP;
    commaSeparatedRegex = COMMA_SEPARATED_STRING_PATTERN;

    // Since we are dynamically generating the task provider's form, these are the possible fields
    selectedTaskProviderConfigOptions: any = {};

    constructor() {
    }

    ngOnInit() {
        this.initializeTaskProvider();
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

    onProviderChange(selectedProvider) {
        let configFieldsGroup: any, credentialFieldsGroup: any, selectedTaskProvider: any;
        configFieldsGroup = {};
        selectedTaskProvider = this.taskProviderOptions.filter(provider => provider.Type === selectedProvider)[0];

        this.showConfigFields = false;

        selectedTaskProvider['Fields'].forEach(field => {
            configFieldsGroup[field.FieldName] = new FormControl('',
                field.Required ? Validators.required : null);
        });

        const ticketTypeMappingGroup = {
            [TRACKER_TICKET_TYPE_MAP.FEATURE]: new FormControl('', Validators.required),
            [TRACKER_TICKET_TYPE_MAP.TASK]: new FormControl('', Validators.required),
            [TRACKER_TICKET_TYPE_MAP.BUG]: new FormControl('', Validators.required)
        };

        const ticketStatusMappingGroup = {
            [TRACKER_TICKET_STATUS_MAP.DONE]: new FormControl('', Validators.required)
        };

        configFieldsGroup = {...configFieldsGroup, ...ticketTypeMappingGroup, ...ticketStatusMappingGroup};

        this.taskProviderFormGroup.setControl(this.taskProviderConfigKey,
            new FormGroup(configFieldsGroup, Validators.required));

        credentialFieldsGroup = {
            'type': new FormControl('', Validators.required),
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
}
