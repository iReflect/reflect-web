import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatChipInputEvent, MatDialogRef, MatSnackBar } from '@angular/material';

import * as _ from 'lodash';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';

import { 
    API_RESPONSE_MESSAGES,
    COMMA_SEPARATED_STRING_PATTERN,
    DUMMY_HIDDEN_VALUE,
    SNACKBAR_DURATION,
    TRACKER_TICKET_TYPE_MAP,
    EDIT_LEVELS } from '@constants/app-constants';
import { RetrospectiveService } from 'app/shared/services/retrospective.service';
import { UtilsService } from 'app/shared/utils/utils.service';

@Component({
    selector: 'app-retrospective-create',
    templateUrl: './retrospective-create.component.html',
    styleUrls: ['./retrospective-create.component.scss']
})
export class RetrospectiveCreateComponent implements OnInit, OnDestroy {
    retroFormGroup: FormGroup;
    isTeamOptionsLoaded = false;
    isProviderOptionsLoaded = false;
    isRetrospectLoaded = false;
    disableButton = false;

    // These are the possible options for the teams and task providers
    teamOptions: any = [];
    taskProviderOptions: any = [];

    // It is used to render the task provider components (When we add a task provider,
    // a new entry will be made in this list with a true value (as of now))
    taskProvidersList: any = [];
    // Maintains the task providers count
    taskProvidersIndex = -1;

    timeProvidersList: any = [];
    disableTimeProviderField = true;
    selectedTimeProvider = {};
    // Keys used for form controls and provider lookups
    taskProviderKey = 'taskProvider';
    public retrospective: any;
    public retrospectiveID: number;
    public isUpdateMode: boolean;
    public fieldsEditableMap: any;
    public ProjectNames = new Map<string, boolean>();
    private originalPassword: string;
    commaSeparatedRegex = COMMA_SEPARATED_STRING_PATTERN;
    // Enter, comma
    public separatorKeysCodes = [ENTER, COMMA];
    private destroy$: Subject<boolean> = new Subject<boolean>();

    constructor(
        private retrospectiveService: RetrospectiveService,
        private snackBar: MatSnackBar,
        private utils: UtilsService,
        public dialogRef: MatDialogRef<RetrospectiveCreateComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        if (data && data['retrospective']) {
            this.retrospective = data['retrospective'];
            this.retrospectiveID = this.retrospective.ID;
            this.isUpdateMode = true;
        }
    }

    ngOnInit() {
        this.createRetroFormGroup();
        this.getTaskProviders();
        this.getTeamList();
        this.addTaskProvider();
        if (this.isUpdateMode) {
            this.hidePassword();
            this.getFieldsEditLevel();
        }
    }

    ngOnDestroy() {
        this.destroy$.next(true);
        this.destroy$.complete();
    }
    get projectNameControl() {
        return this.retroFormGroup.get('projectName');
    }

    hidePassword() {
        if (this.retrospective.TaskProviderConfig[0].data.credentials.type === 'basicAuth') {
            // Replacing orginal password With dummy value
            this.originalPassword = this.retrospective.TaskProviderConfig[0].data.credentials.password;
            this.retrospective.TaskProviderConfig[0].data.credentials.password = DUMMY_HIDDEN_VALUE;
        } else if (this.retrospective.TaskProviderConfig[0].data.credentials.type === 'apiToken') {
            // Replacing orginal API token With dummy value
            this.originalPassword = this.retrospective.TaskProviderConfig[0].data.credentials.apiToken;
            this.retrospective.TaskProviderConfig[0].data.credentials.apiToken = DUMMY_HIDDEN_VALUE;
        }
    }

    getFieldsEditLevel() {
        this.retrospectiveService.getFieldEditLevel(this.retrospectiveID).subscribe(
            response => {
                this.fieldsEditableMap = response.data;
                this.setValueAndDisableState('title', 'Title');
                this.setValueAndDisableState('team', 'TeamID');
                this.setValueAndDisableState('storyPointPerWeek', 'StoryPointPerWeek');
                this.setValueAndDisableState('projectName', 'ProjectName');
                this.projectNameControl.value.split(',').forEach((element: string) => {
                    this.ProjectNames.set(element, false);
                });
                this.isRetrospectLoaded = true;
            },
          );
    }

    getEditableState(name: string): boolean {
        return !(this.isUpdateMode && this.fieldsEditableMap[name] === EDIT_LEVELS.NOT_EDITABLE);
    }

    // This function will set value and its edit states of form fields.
    setValueAndDisableState(formFieldName: string, name: string) {
        this.retroFormGroup.patchValue({[formFieldName]: this.retrospective[name]});

        if (this.fieldsEditableMap[name] === EDIT_LEVELS.NOT_EDITABLE) {
            this.retroFormGroup.get(formFieldName).disable();
        }
    }

    getProjectMap() {
        return Array.from(this.ProjectNames.keys());
    }
    addChip(event: MatChipInputEvent) {
        const input = event.input;
        const value = event.value;

        // Reset the input value
      if (input) { input.value = ''; }

      if (Array.from(this.ProjectNames.keys()).findIndex(element => value.toLowerCase() === element.toLowerCase()) > -1) {
        return;
      }
      if ((value || '').trim()) {
            // Add our project
            this.ProjectNames.set(value.trim(), true);
            this.projectNameControl.patchValue(Array.from(this.ProjectNames.keys()).toString());
        }
    }
    removeChip(keyword: string): void {
        this.ProjectNames.delete(keyword);
        this.projectNameControl.patchValue(Array.from(this.ProjectNames.keys()).toString());
      }

    getTeamList() {
        this.retrospectiveService.getTeamList()
            .takeUntil(this.destroy$)
            .subscribe(
                response => {
                    if (_.isEmpty(response.data.Teams)) {
                        this.snackBar.open(
                            API_RESPONSE_MESSAGES.noTeamsError,
                            '', {duration: SNACKBAR_DURATION});
                        this.dialogRef.close();
                    } else {
                        this.teamOptions = response.data.Teams;
                        this.isTeamOptionsLoaded = true;
                    }
                },
                err => {
                    this.snackBar.open(
                        this.utils.getApiErrorMessage(err) || API_RESPONSE_MESSAGES.getTeamListError,
                        '', {duration: SNACKBAR_DURATION});
                    this.dialogRef.close();
                }
            );
    }

    getTaskProviders() {
        this.retrospectiveService.getTaskProvidersList()
            .takeUntil(this.destroy$)
            .subscribe(
                response => {
                    this.taskProviderOptions = response.data.TaskProviders;
                    this.isProviderOptionsLoaded = true;
                },
                err => {
                    this.snackBar.open(
                        this.utils.getApiErrorMessage(err) || API_RESPONSE_MESSAGES.getTeamProviderOptionsError,
                        '', {duration: SNACKBAR_DURATION});
                    this.dialogRef.close();
                }
            );
    }

    getTimeProviders() {
        const team: string = this.retroFormGroup.getRawValue().team;
        let selectedTaskProvider: string;
        this.retroFormGroup.getRawValue().taskProvider.forEach(provider => {
            selectedTaskProvider = provider.selectedTaskProvider;
        });
        if (!team || !selectedTaskProvider) {
            return;
        }
        this.retrospectiveService.getTimeProvidersList(selectedTaskProvider, team)
        .subscribe(
            (data) => {
                this.timeProvidersList = data.body.TimeProviders;
                if (this.isUpdateMode) {
                    this.setValueAndDisableState('timeProviderKey', 'TimeProviderName');
                } else {
                    this.selectedTimeProvider = this.timeProvidersList[0];
                }
                this.disableTimeProviderField = false;
            },
            (err: Error) => {
                this.disableTimeProviderField = true;
                this.snackBar.open(
                    this.utils.getApiErrorMessage(err) || API_RESPONSE_MESSAGES.getTimeProviderOptionError,
                    '', {duration: SNACKBAR_DURATION});
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
            'storyPointPerWeek': new FormControl('', Validators.required),
            'projectName': new FormControl('', Validators.required),
            'timeProviderKey': new FormControl({value: '', disable: true}, Validators.required),
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
        const requestBody = this.parseRetroData(formValue);

        this.retrospectiveService.createRetro(requestBody)
            .takeUntil(this.destroy$)
            .subscribe(
                () => {
                    this.snackBar.open(
                        API_RESPONSE_MESSAGES.retroCreated,
                        '', {duration: SNACKBAR_DURATION});
                    this.dialogRef.close(true);
                    this.disableButton = false;
                },
                err => {
                    this.snackBar.open(
                        this.utils.getApiErrorMessage(err) || API_RESPONSE_MESSAGES.createRetroError,
                        '', {duration: SNACKBAR_DURATION});
                    this.disableButton = false;
                }
            );
    }

    updateRetro(formValue: any) {
        this.disableButton = true;
        const requestBody = this.parseRetroData(formValue);

        // set credentialChanged key to true.
        requestBody['credentialsChanged'] = true;
        // add retroID in the request body.
        requestBody['retroID'] = this.retrospective.ID;

        // if credential are not changed we will set credentialChanged key to false and set original password back.
        if (!this.isCredentialsChanged(requestBody.taskProvider[0].data.credentials)) {
            if (requestBody.taskProvider[0].data.credentials.type === 'apiToken') {
                requestBody.taskProvider[0].data.credentials.apiToken = this.originalPassword;
            } else {
                requestBody.taskProvider[0].data.credentials.password = this.originalPassword;
            }
            requestBody['credentialsChanged'] = false;
        }

        this.retrospectiveService.updateRetro(this.retrospectiveID, requestBody)
            .takeUntil(this.destroy$)
            .subscribe(
                () => {
                    this.snackBar.open(
                        API_RESPONSE_MESSAGES.retroUpdated,
                        '', {duration: SNACKBAR_DURATION});
                    this.dialogRef.close(true);
                    this.disableButton = false;
                },
                err => {
                    this.snackBar.open(
                        this.utils.getApiErrorMessage(err) || API_RESPONSE_MESSAGES.updateRetroError,
                        '', {duration: SNACKBAR_DURATION});
                    this.disableButton = false;
                }
            );
    }
    isCredentialsChanged(currentCredentials: any): boolean {
        if (currentCredentials.type === 'basicAuth') {
           return currentCredentials.password !== DUMMY_HIDDEN_VALUE
        || currentCredentials.username !== this.retrospective.TaskProviderConfig[0].data.credentials.username;
        }
        if (currentCredentials.type === 'apiToken') {
            return currentCredentials.apiToken !== DUMMY_HIDDEN_VALUE;
         }
    }
    parseRetroData(formValue: any) {
        return {
            'title': formValue.title,
            'team': formValue.team,
            'storyPointPerWeek': formValue.storyPointPerWeek,
            'projectName': formValue.projectName,
            'timeProviderKey': formValue.timeProviderKey,
            'taskProvider': formValue.taskProvider.map(provider => {
                const taskProviderConfig = provider.taskProviderConfig;

                // Parse the ticket type mapping to a list of keywords
                _.forEach(TRACKER_TICKET_TYPE_MAP, (ticketType) => {
                    const ticketTypeValue = taskProviderConfig[ticketType];
                    if (_.isString(ticketTypeValue)) {
                        // trim trailing and leading commas and spaces
                        taskProviderConfig[ticketType] = ticketTypeValue.replace(/(^(,|\s)+)|((,|\s)+$)/g, '');
                    }
                });

                return {
                    'type': provider.selectedTaskProvider,
                    'data': {
                        ...taskProviderConfig,
                        'credentials': {
                            ...provider.Credentials.data,
                            'type': provider.Credentials.type
                        }
                    }
                };
            })
        };
    }
    closeDialog(result = false) {
        this.dialogRef.close(result);
    }
}
