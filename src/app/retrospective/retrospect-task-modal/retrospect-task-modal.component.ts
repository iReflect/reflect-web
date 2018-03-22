import { Component, HostListener, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { ColumnApi, GridApi, GridOptions } from 'ag-grid';
import * as _ from 'lodash';
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/takeUntil';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import {
    API_RESPONSE_MESSAGES,
    MEMBER_TASK_ROLES,
    MEMBER_TASK_ROLES_LABEL,
    RATING_STATES,
    RATING_STATES_LABEL,
    SNACKBAR_DURATION,
    SPRINT_STATES
} from '../../../constants/app-constants';
import { NumericCellEditorComponent } from '../../shared/ag-grid-editors/numeric-cell-editor/numeric-cell-editor.component';
import { SelectCellEditorComponent } from '../../shared/ag-grid-editors/select-cell-editor/select-cell-editor.component';
import { RatingRendererComponent } from '../../shared/ag-grid-renderers/rating-renderer/rating-renderer.component';
import { RetrospectiveService } from '../../shared/services/retrospective.service';
import { RetrospectiveCreateComponent } from '../retrospective-create/retrospective-create.component';
import { UtilsService } from '../../shared/utils/utils.service';

@Component({
    selector: 'app-retrospect-task-modal',
    templateUrl: './retrospect-task-modal.component.html',
    styleUrls: ['./retrospect-task-modal.component.scss']
})
export class RetrospectTaskModalComponent implements OnDestroy {
    memberIDs = [];
    sprintMembers: any;
    taskDetails: any;
    selectedMemberID: number;
    gridOptions: GridOptions;
    enableRefresh: boolean;
    autoRefreshCurrentState: boolean;
    sprintStates = SPRINT_STATES;
    ratingStates = RATING_STATES;
    destroy$: Subject<boolean> = new Subject<boolean>();
    overlayLoadingTemplate = '<span class="ag-overlay-loading-center">Please wait while the members are loading!</span>';
    overlayNoRowsTemplate = '<span>No Members for this Task!</span>';


    private totalTaskPoints;
    private params: any;
    private columnDefs: any;
    private gridApi: GridApi;
    private columnApi: ColumnApi;

    constructor(private retrospectiveService: RetrospectiveService,
                private snackBar: MatSnackBar,
                private utils: UtilsService,
                public dialogRef: MatDialogRef<RetrospectiveCreateComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any) {
        this.enableRefresh = data.enableRefresh;
        this.autoRefreshCurrentState = data.enableRefresh;
        this.taskDetails = data.taskDetails;
        if (!this.taskDetails.Estimate) {
            this.taskDetails.Estimate = 0;
        }
        this.getSprintMembers();
        this.columnDefs = this.createColumnDefs(data.sprintStatus);
        this.setGridOptions();
    }

    @HostListener('window:resize') onResize() {
        if (this.gridApi) {
            setTimeout(() => {
                this.gridApi.sizeColumnsToFit();
            });
        }
    }

    ngOnDestroy() {
        this.autoRefreshCurrentState = false;
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
    }

    onCellEditingStarted() {
        this.autoRefreshCurrentState = false;
    }

    onCellEditingStopped() {
        this.autoRefreshCurrentState = this.enableRefresh;
    }

    getSprintMembers() {
        this.retrospectiveService.getSprintMembers(this.data.retrospectiveID, this.data.sprintID).subscribe(
            response => {
                this.sprintMembers = response.data.Members;
            },
            err => {
                this.snackBar.open(
                    this.utils.getApiErrorMessage(err) || API_RESPONSE_MESSAGES.getSprintMembersError,
                    '', {duration: SNACKBAR_DURATION});
            }
        );
    }

    setGridOptions() {
        this.gridOptions = <GridOptions>{
            columnDefs: this.columnDefs,
            rowHeight: 48,
            singleClickEdit: true,
            frameworkComponents: {
                'selectEditor': SelectCellEditorComponent,
                'ratingRenderer': RatingRendererComponent,
                'numericEditor': NumericCellEditorComponent
            }
        };
    }

    onGridReady(params) {
        this.params = params;
        this.gridApi = params.api;
        this.columnApi = params.columnApi;
        this.getSprintTaskMemberSummary(false);
        Observable.interval(5000)
            .takeUntil(this.destroy$)
            .subscribe(() => {
                if (this.autoRefreshCurrentState) {
                    this.getSprintTaskMemberSummary(true);
                }
            });
    }

    getSprintTaskMemberSummary(isRefresh) {
        this.retrospectiveService.getSprintTaskMemberSummary(this.data.retrospectiveID, this.data.sprintID, this.taskDetails.ID)
            .subscribe(
                response => {
                    this.gridApi.setRowData(response.data.Members);
                    this.totalTaskPoints = 0;
                    this.memberIDs = [];
                    response.data.Members.forEach(member => {
                        this.memberIDs.push(member.ID);
                        this.totalTaskPoints += member.TotalPoints;
                    });
                    this.columnApi.getColumn('SprintPoints').getColDef().cellEditorParams = {
                        addCellValueToMax: true,
                        minValue: 0,
                        baseMaxValue: this.taskDetails.Estimate - this.totalTaskPoints
                    };
                    if (!isRefresh) {
                        this.gridApi.sizeColumnsToFit();
                    }
                },
                err => {
                    if (isRefresh) {
                        this.snackBar.open(
                            this.utils.getApiErrorMessage(err) || API_RESPONSE_MESSAGES.autoRefreshFailure,
                            '', {duration: SNACKBAR_DURATION});
                    } else {
                        this.snackBar.open(
                            this.utils.getApiErrorMessage(err) || API_RESPONSE_MESSAGES
                                .getSprintTaskMemberSummaryError,
                            '', {duration: SNACKBAR_DURATION});
                        this.dialogRef.close();
                    }
                }
            );
    }

    addNewSprintTaskMember() {
        if (this.selectedMemberID === undefined) {
            this.snackBar.open(
                API_RESPONSE_MESSAGES.memberNotSelectedError,
                '', {duration: SNACKBAR_DURATION});
        } else if (this.memberIDs.indexOf(this.selectedMemberID) !== -1) {
            this.snackBar.open(
                API_RESPONSE_MESSAGES.memberAlreadyPresent,
                '', {duration: SNACKBAR_DURATION});
        } else {
            this.retrospectiveService.addTaskMember(
                this.data.retrospectiveID, this.data.sprintID, this.taskDetails.ID, this.selectedMemberID
            ).subscribe(
                response => {
                    this.gridApi.updateRowData({add: [response.data]});
                    this.memberIDs.push(this.selectedMemberID);
                },
                err => {
                    this.snackBar.open(
                        this.utils.getApiErrorMessage(err) || API_RESPONSE_MESSAGES.addSprintTaskMemberError,
                        '', {duration: SNACKBAR_DURATION});
                }
            );
        }
    }

    updateSprintTaskMember(params, onSuccessCallback?) {
        this.retrospectiveService.updateSprintTaskMember(this.data.retrospectiveID, this.data.sprintID, this.taskDetails.ID, params.data)
            .subscribe(
                response => {
                    if (onSuccessCallback && _.isFunction(onSuccessCallback)) {
                        onSuccessCallback(response);
                    }
                    params.node.setData(response.data);
                    this.snackBar.open(
                        API_RESPONSE_MESSAGES.memberUpdated,
                        '', {duration: SNACKBAR_DURATION});
                },
                err => {
                    this.snackBar.open(
                        this.utils.getApiErrorMessage(err) || API_RESPONSE_MESSAGES.updateSprintMemberError,
                        '', {duration: SNACKBAR_DURATION});
                    this.revertCellValue(params);
                }
            );
    }

    revertCellValue(params) {
        const rowData = params.data;
        rowData[params.colDef.field] = params.oldValue;
        this.gridApi.updateRowData({update: [rowData]});
        this.gridApi.refreshCells();
    }

    closeDialog(result = false) {
        this.dialogRef.close(result);
    }

    private createColumnDefs(sprintStatus) {
        let editable = true;
        if (sprintStatus === this.sprintStates.FROZEN) {
            editable = false;
        }
        const columnDefs = [
            {
                headerName: 'Name',
                colId: 'Name',
                valueGetter: (params) => {
                    return (params.data.FirstName + ' ' + params.data.LastName).trim();
                },
                minWidth: 160,
                pinned: true
            },
            {
                headerName: 'Role',
                field: 'Role',
                minWidth: 150,
                valueFormatter: (cellParams) => {
                    return MEMBER_TASK_ROLES_LABEL[cellParams.value];
                },
                editable: editable,
                cellEditor: 'selectEditor',
                cellEditorParams: {
                    selectOptions: _.map(MEMBER_TASK_ROLES_LABEL, (value, key) => {
                        return {
                            id: _.parseInt(key),
                            value: value
                        };
                    }),
                },
                onCellValueChanged: (cellParams) => {
                    if ((cellParams.newValue !== cellParams.oldValue) &&
                        (cellParams.newValue >= MEMBER_TASK_ROLES.IMPLEMENTOR && cellParams.newValue <= MEMBER_TASK_ROLES.VALIDATOR)) {
                        this.updateSprintTaskMember(cellParams);
                    }
                }
            },
            {
                headerName: 'Sprint Hours',
                field: 'SprintTime',
                valueFormatter: (params) => this.utils.formatFloat(params.value / 60),
                minWidth: 150
            },
            {
                headerName: 'Total Time',
                field: 'TotalTime',
                valueFormatter: (params) => this.utils.formatFloat(params.value / 60),
                minWidth: 140
            },
            {
                headerName: 'Sprint Story Points',
                field: 'SprintPoints',
                editable: editable,
                minWidth: 185,
                valueParser: 'Number(newValue)',
                cellEditor: 'numericEditor',
                valueFormatter: (cellParams) => this.utils.formatFloat(cellParams.value),
                onCellValueChanged: (cellParams) => {
                    const valueChange = cellParams.newValue - cellParams.oldValue;
                    const newStoryPoints = this.totalTaskPoints + valueChange;
                    if (cellParams.newValue !== cellParams.oldValue) {
                        if (newStoryPoints > this.taskDetails.Estimate) {
                            this.snackBar.open(
                                API_RESPONSE_MESSAGES.taskStoryPointsEstimatesError,
                                '', {duration: SNACKBAR_DURATION});
                            this.revertCellValue(cellParams);
                        } else if (cellParams.newValue < 0) {
                            this.snackBar.open(
                                API_RESPONSE_MESSAGES.taskStoryPointsNegativeError,
                                '', {duration: SNACKBAR_DURATION});
                            this.revertCellValue(cellParams);
                        } else {
                            this.updateSprintTaskMember(cellParams, (response) => {
                                this.totalTaskPoints += response.data.TotalPoints - cellParams.data.TotalPoints;
                                this.columnApi.getColumn('SprintPoints').getColDef().cellEditorParams = {
                                    addCellValueToMax: true,
                                    minValue: 0,
                                    baseMaxValue: this.taskDetails.Estimate - this.totalTaskPoints
                                };
                            });
                        }
                    }
                },
                suppressKeyboardEvent: (event) => this.utils.isAgGridEditingEvent(event)
            },
            {
                headerName: 'Total Story Points',
                field: 'TotalPoints',
                minWidth: 180,
                valueFormatter: (cellParams) => this.utils.formatFloat(cellParams.value)
            },
            {
                headerName: 'Rating',
                field: 'Rating',
                minWidth: 150,
                editable: editable,
                cellEditor: 'selectEditor',
                cellEditorParams: {
                    selectOptions: _.map(RATING_STATES_LABEL, (value, key) => {
                        return {
                            id: _.parseInt(key),
                            value: value
                        };
                    }).reverse(),
                },
                cellRenderer: 'ratingRenderer',
                onCellValueChanged: (cellParams) => {
                    if ((cellParams.newValue !== cellParams.oldValue) &&
                        (cellParams.newValue >= this.ratingStates.RED && cellParams.newValue <= this.ratingStates.NOTABLE)) {
                        this.updateSprintTaskMember(cellParams);
                    }
                }
            },
            {
                headerName: 'Comments',
                field: 'Comment',
                minWidth: 300,
                tooltipField: 'Comment',
                cellEditor: 'agLargeTextCellEditor',
                editable: editable,
                onCellValueChanged: (cellParams) => {
                    if (cellParams.newValue !== cellParams.oldValue) {
                        this.updateSprintTaskMember(cellParams);
                    }
                },
                suppressKeyboardEvent: (event) => this.utils.isAgGridEditingEvent(event)
            }
        ];
    }
}
