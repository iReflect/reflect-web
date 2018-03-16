import { Component, HostListener, Inject, OnDestroy } from '@angular/core';
import {
    API_RESPONSE_MESSAGES, MEMBER_TASK_ROLES, MEMBER_TASK_ROLES_LABEL, RATING_STATES, RATING_STATES_LABEL,
    SNACKBAR_DURATION, SPRINT_STATES
} from '../../../constants/app-constants';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { RetrospectiveService } from '../../shared/services/retrospective.service';
import { RetrospectiveCreateComponent } from '../retrospective-create/retrospective-create.component';
import { GridOptions } from 'ag-grid';
import { RatingRendererComponent } from '../../shared/ag-grid-renderers/rating-renderer/rating-renderer.component';
import { NumericCellEditorComponent } from '../../shared/ag-grid-editors/numeric-cell-editor/numeric-cell-editor.component';
import { SelectCellEditorComponent } from '../../shared/ag-grid-editors/select-cell-editor/select-cell-editor.component';
import * as _ from 'lodash';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/observable/interval';

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
    enableRefresh = true;
    sprintStates = SPRINT_STATES;
    ratingStates = RATING_STATES;
    destroy$: Subject<boolean> = new Subject<boolean>();

    private totalTaskPoints;
    private params: any;
    private columnDefs: any;
    private gridApi: any;
    private columnApi: any;

    @HostListener('window:resize') onResize() {
        if (this.gridApi) {
            setTimeout(() => {
                this.gridApi.sizeColumnsToFit();
            });
        }
    }

    constructor(private retrospectiveService: RetrospectiveService,
                private snackBar: MatSnackBar,
                public dialogRef: MatDialogRef<RetrospectiveCreateComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any) {
        this.enableRefresh = true;
        this.taskDetails = data.taskDetails;
        this.getSprintMembers();
        this.columnDefs = this.createColumnDefs(data.sprintStatus);
        this.setGridOptions();
    }

    ngOnDestroy() {
        this.enableRefresh = false;
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
    }

    onCellEditingStarted() {
        this.enableRefresh = false;
    }

    onCellEditingStopped() {
        this.enableRefresh = true;
    }

    getSprintMembers() {
        this.retrospectiveService.getSprintMembers(this.data.retrospectiveID, this.data.sprintID).subscribe(
            response => {
                this.sprintMembers = response.data.Members;
            },
            () => {
                this.snackBar.open(API_RESPONSE_MESSAGES.getSprintMembersError, '', {duration: SNACKBAR_DURATION});
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
                if (this.enableRefresh) {
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
                () => {
                    if (isRefresh) {
                        this.snackBar.open(API_RESPONSE_MESSAGES.autoRefreshFailure, '', {duration: SNACKBAR_DURATION});
                    } else {
                        this.snackBar.open(API_RESPONSE_MESSAGES.getSprintTaskMemberSummaryError, '', {duration: SNACKBAR_DURATION});
                        this.closeDialog();
                    }
                }
            );
    }

    private commentsValueFormatter(cellParams) {
        const comment = cellParams.value.trim();
        const newLineIndex = comment.indexOf('\n');
        if (newLineIndex !== -1) {
            return comment.substr(0, newLineIndex) + '...';
        }
        return comment;
    }

    private supressKeyboardEvent(event) {
        if (event.editing) {
            return true;
        }
    }

    private createColumnDefs(sprintStatus) {
        let columnDefs;
        const nameColumn = [
            {
                headerName: 'Name',
                colId: 'Name',
                valueGetter: (params) => {
                    return (params.data.FirstName + ' ' + params.data.LastName).trim();
                },
                minWidth: 160,
                pinned: true
            }
        ];
        const timeColumns = [
            {
                headerName: 'Sprint Hours',
                field: 'SprintTime',
                valueFormatter: (params) => (params.value / 60).toFixed(2),
                minWidth: 150
            },
            {
                headerName: 'Total Time',
                field: 'TotalTime',
                valueFormatter: (params) => (params.value / 60).toFixed(2),
                minWidth: 140
            }
        ];
        const totalPointsColumn = [
            {
                headerName: 'Total Story Points',
                field: 'TotalPoints',
                minWidth: 180
            }
        ];
        if (sprintStatus === this.sprintStates.FROZEN) {
            columnDefs = [
                ...nameColumn,
                {
                    headerName: 'Role',
                    field: 'Role',
                    minWidth: 150,
                    valueFormatter: (cellParams) => {
                        return MEMBER_TASK_ROLES_LABEL[cellParams.value];
                    }
                },
                ...timeColumns,
                {
                    headerName: 'Sprint Story Points',
                    field: 'SprintPoints',
                    minWidth: 185
                },
                ...totalPointsColumn,
                {
                    headerName: 'Rating',
                    field: 'Rating',
                    minWidth: 150,
                    cellRenderer: 'ratingRenderer'
                },
                {
                    headerName: 'Comments',
                    field: 'Comment',
                    minWidth: 300,
                    tooltipField: 'Comment',
                    valueFormatter: (cellParams) => this.commentsValueFormatter(cellParams)
                }
            ];
        } else {
            columnDefs = [
                ...nameColumn,
                {
                    headerName: 'Role',
                    field: 'Role',
                    minWidth: 150,
                    valueFormatter: (cellParams) => {
                        return MEMBER_TASK_ROLES_LABEL[cellParams.value];
                    },
                    editable: true,
                    cellEditor: 'selectEditor',
                    cellEditorParams: {
                        labels: MEMBER_TASK_ROLES_LABEL,
                        values: [
                            MEMBER_TASK_ROLES.IMPLEMENTOR,
                            MEMBER_TASK_ROLES.REVIEWER,
                            MEMBER_TASK_ROLES.VALIDATOR
                        ]
                    },
                    onCellValueChanged: (cellParams) => {
                        if ((cellParams.newValue !== cellParams.oldValue) &&
                            (cellParams.newValue >= MEMBER_TASK_ROLES.IMPLEMENTOR && cellParams.newValue <= MEMBER_TASK_ROLES.VALIDATOR)) {
                            this.updateSprintTaskMember(cellParams);
                        }
                    }
                },
                ...timeColumns,
                {
                    headerName: 'Sprint Story Points',
                    field: 'SprintPoints',
                    editable: true,
                    minWidth: 185,
                    valueParser: 'Number(newValue)',
                    cellEditor: 'numericEditor',
                    onCellValueChanged: (cellParams) => {
                        const valueChange = cellParams.newValue - cellParams.oldValue;
                        const newStoryPoints = this.totalTaskPoints + valueChange;
                        if (cellParams.newValue !== cellParams.oldValue) {
                            if (newStoryPoints > this.taskDetails.Estimate) {
                                this.snackBar.open(
                                    API_RESPONSE_MESSAGES.taskStoryPointsEstimatesError,
                                    '',
                                    {duration: SNACKBAR_DURATION}
                                );
                                this.revertCellValue(cellParams);
                            } else if (cellParams.newValue < 0) {
                                this.snackBar.open(
                                    API_RESPONSE_MESSAGES.taskStoryPointsNegativeError,
                                    '',
                                    {duration: SNACKBAR_DURATION}
                                );
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
                    suppressKeyboardEvent: (event) => this.supressKeyboardEvent(event)
                },
                ...totalPointsColumn,
                {
                    headerName: 'Rating',
                    field: 'Rating',
                    minWidth: 150,
                    editable: true,
                    cellEditor: 'selectEditor',
                    cellEditorParams: {
                        labels: RATING_STATES_LABEL,
                        values: [
                            this.ratingStates.UGLY,
                            this.ratingStates.BAD,
                            this.ratingStates.OKAY,
                            this.ratingStates.GOOD,
                            this.ratingStates.NOTABLE
                        ]
                    },
                    cellRenderer: 'ratingRenderer',
                    onCellValueChanged: (cellParams) => {
                        if ((cellParams.newValue !== cellParams.oldValue) &&
                            (cellParams.newValue >= this.ratingStates.UGLY && cellParams.newValue <= this.ratingStates.NOTABLE)) {
                            this.updateSprintTaskMember(cellParams);
                        }
                    }
                },
                {
                    headerName: 'Comments',
                    field: 'Comment',
                    minWidth: 300,
                    filter: 'text',
                    tooltipField: 'Comment',
                    cellEditor: 'agLargeTextCellEditor',
                    editable: true,
                    onCellValueChanged: (cellParams) => {
                        if (cellParams.newValue !== cellParams.oldValue) {
                            this.updateSprintTaskMember(cellParams);
                        }
                    },
                    valueFormatter: (cellParams) => this.commentsValueFormatter(cellParams)
                }
            ];
        }
        return columnDefs;
    }

    addNewSprintTaskMember() {
        if (this.selectedMemberID === undefined) {
            this.snackBar.open(API_RESPONSE_MESSAGES.memberNotSelectedError, '', {duration: SNACKBAR_DURATION});
        } else if (this.memberIDs.indexOf(this.selectedMemberID) !== -1) {
            this.snackBar.open(API_RESPONSE_MESSAGES.memberAlreadyPresent, '', {duration: SNACKBAR_DURATION});
        } else {
            this.retrospectiveService.addTaskMember(
                this.data.retrospectiveID, this.data.sprintID, this.taskDetails.ID, this.selectedMemberID
            ).subscribe(
                response => {
                    this.gridApi.updateRowData({ add: [response.data] });
                    this.memberIDs.push(this.selectedMemberID);
                },
                () => {
                    this.snackBar.open(API_RESPONSE_MESSAGES.addSprintTaskMemberError, '', {duration: SNACKBAR_DURATION});
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
                    this.snackBar.open(API_RESPONSE_MESSAGES.memberUpdated, '', {duration: SNACKBAR_DURATION});
                },
                () => {
                    this.snackBar.open(API_RESPONSE_MESSAGES.updateSprintMemberError, '', {duration: SNACKBAR_DURATION});
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
}
