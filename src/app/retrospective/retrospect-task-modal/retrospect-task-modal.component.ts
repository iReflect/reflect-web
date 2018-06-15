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
    AUTO_REFRESH_DURATION,
    MEMBER_TASK_ROLES,
    MEMBER_TASK_ROLES_LABEL,
    RATING_STATES,
    RATING_STATES_LABEL,
    SNACKBAR_DURATION
} from '../../../constants/app-constants';
import { NumericCellEditorComponent } from '../../shared/ag-grid-editors/numeric-cell-editor/numeric-cell-editor.component';
import { SelectCellEditorComponent } from '../../shared/ag-grid-editors/select-cell-editor/select-cell-editor.component';
import { RatingRendererComponent } from '../../shared/ag-grid-renderers/rating-renderer/rating-renderer.component';
import { RetrospectiveService } from '../../shared/services/retrospective.service';
import { RetrospectiveCreateComponent } from '../retrospective-create/retrospective-create.component';
import { UtilsService } from '../../shared/utils/utils.service';
import {
    CellClassParams, IsColumnFuncParams, NewValueParams,
    SuppressKeyboardEventParams
} from 'ag-grid/src/ts/entities/colDef';
import { AfterViewChecked } from '@angular/core/src/metadata/lifecycle_hooks';

@Component({
    selector: 'app-retrospect-task-modal',
    templateUrl: './retrospect-task-modal.component.html',
    styleUrls: ['./retrospect-task-modal.component.scss']
})
export class RetrospectTaskModalComponent implements OnDestroy, AfterViewChecked {
    sprintMembers: any;
    taskDetails: any;
    selectedMemberID: number;
    gridOptions: GridOptions;
    enableRefresh: boolean;
    autoRefreshCurrentState: boolean;
    issueDescriptionHTML: string;

    memberIDs = [];
    ratingStates = RATING_STATES;
    overlayLoadingTemplate = '<span class="ag-overlay-loading-center">Please wait while the Issue Members are loading!</span>';
    overlayNoRowsTemplate = '<span>No Members for this Issue!</span>';
    expandedDescHidden = true;
    allowDescViewToggle = true;
    descMaxHeight = 90;

    private totalTaskPoints;
    private params: any;
    private columnDefs: any;
    private gridApi: GridApi;
    private columnApi: ColumnApi;
    private destroy$: Subject<boolean> = new Subject<boolean>();

    constructor(
        private retrospectiveService: RetrospectiveService,
        private snackBar: MatSnackBar,
        private utils: UtilsService,
        public dialogRef: MatDialogRef<RetrospectiveCreateComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.enableRefresh = data.enableRefresh;
        this.autoRefreshCurrentState = data.enableRefresh;
        this.taskDetails = data.taskDetails;
        // TODO: Check for better ways of handling new lines, carriage returns in angular
        this.issueDescriptionHTML = this.data.taskDetails.Description.replace(/\r\n|↵|\n/g, '<br>');
        if (!this.taskDetails.Estimate) {
            this.taskDetails.Estimate = 0;
        }
        this.getSprintMembers();
        this.columnDefs = this.createColumnDefs(data.isSprintEditable);
        this.setGridOptions();
    }

    @HostListener('window:resize') onResize() {
        if (this.gridApi) {
            setTimeout(() => {
                this.gridApi.sizeColumnsToFit();
            });
        }
    }

    ngAfterViewChecked() {
        const issueDescElement = document.getElementById('issue-description');
        // If the height of the description section is not more than 90px (since 90 is the max-height for description section,
        // we won't show "Show More" and/or "Show Less" buttons.
        if (issueDescElement && issueDescElement.offsetHeight < this.descMaxHeight) {
            setTimeout(() => {
                this.allowDescViewToggle = false;
            });
        }
    }

    ngOnDestroy() {
        this.autoRefreshCurrentState = false;
        this.destroy$.next(true);
        this.destroy$.complete();
    }

    onCellEditingStarted() {
        this.autoRefreshCurrentState = false;
    }

    onCellEditingStopped() {
        this.autoRefreshCurrentState = this.enableRefresh;
    }

    getSprintMembers() {
        this.retrospectiveService.getSprintMembers(this.data.retrospectiveID, this.data.sprintID)
            .takeUntil(this.destroy$)
            .subscribe(
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
            frameworkComponents: {
                'selectEditor': SelectCellEditorComponent,
                'ratingRenderer': RatingRendererComponent,
                'numericEditor': NumericCellEditorComponent
            },
            onCellEditingStarted: () => this.onCellEditingStarted(),
            onCellEditingStopped: () => this.onCellEditingStopped(),
            onGridReady: event => this.onGridReady(event),
            overlayLoadingTemplate: this.overlayLoadingTemplate,
            overlayNoRowsTemplate: this.overlayNoRowsTemplate,
            rowHeight: 48,
            rowClassRules: {
                'disabled-ag-grid-row': (params: CellClassParams) => {
                    return !params.data.Current;
                }
            },
            singleClickEdit: true,
            stopEditingWhenGridLosesFocus: true,
            suppressDragLeaveHidesColumns: true,
            suppressScrollOnNewData: true
        };
    }

    onGridReady(params) {
        this.params = params;
        this.gridApi = params.api;
        this.columnApi = params.columnApi;
        this.getSprintTaskMemberSummary();
        Observable.interval(AUTO_REFRESH_DURATION)
            .takeUntil(this.destroy$)
            .subscribe(() => {
                if (this.autoRefreshCurrentState) {
                    this.getSprintTaskMemberSummary(true, true);
                }
            });
    }

    getSprintTaskMemberSummary(isRefresh = false, isAutoRefresh = false) {
        const getTaskMemberSummary$ = this.retrospectiveService
            .getSprintTaskMemberSummary(
                this.data.retrospectiveID,
                this.data.sprintID,
                this.taskDetails.ID,
                isAutoRefresh
            );
        getTaskMemberSummary$
            .takeUntil(this.destroy$)
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
                                .getSprintIssueMemberSummaryError,
                            '', {duration: SNACKBAR_DURATION});
                        this.dialogRef.close();
                    }
                }
            );
        return getTaskMemberSummary$;
    }

    refreshIssueMemberSummaryAgGrid() {
        this.gridApi.showLoadingOverlay();
        // To clear the current content of the grid
        this.gridApi.setRowData(null);
        const getTaskMemberSummary$ = this.getSprintTaskMemberSummary(true);
        getTaskMemberSummary$.subscribe(
            () => {},
            () => {},
            () => this.gridApi.hideOverlay()
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
            ).takeUntil(this.destroy$).subscribe(
                response => {
                    this.refreshIssueMemberSummaryAgGrid();
                },
                err => {
                    this.snackBar.open(
                        this.utils.getApiErrorMessage(err) || API_RESPONSE_MESSAGES.addSprintIssueMemberError,
                        '', {duration: SNACKBAR_DURATION});
                }
            );
        }
    }

    updateSprintTaskMember(params, onSuccessCallback?) {
        const updatedSprintTaskMemberData = {
            [params.colDef.field]: params.newValue
        };
        this.retrospectiveService.updateSprintTaskMember(
            this.data.retrospectiveID,
            this.data.sprintID,
            this.taskDetails.ID,
            params.data.ID,
            updatedSprintTaskMemberData
        ).takeUntil(this.destroy$).subscribe(
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

    private createColumnDefs(isSprintEditable) {
        return [
            {
                headerName: 'Name',
                colId: 'Name',
                valueGetter: (params) => (params.data.FirstName + ' ' + params.data.LastName).trim(),
                minWidth: 160,
                pinned: true
            },
            {
                headerName: 'Role',
                field: 'Role',
                minWidth: 110,
                valueFormatter: (cellParams) => cellParams.data.Current ? MEMBER_TASK_ROLES_LABEL[cellParams.value] : '',
                editable: (params: IsColumnFuncParams) => isSprintEditable && params.data.Current,
                cellEditor: 'selectEditor',
                cellEditorParams: {
                    selectOptions: _.map(MEMBER_TASK_ROLES_LABEL, (value, key) => {
                        return {
                            id: _.parseInt(key),
                            value: value
                        };
                    }),
                },
                onCellValueChanged: (cellParams: NewValueParams) => {
                    if ((cellParams.newValue !== cellParams.oldValue) &&
                        (cellParams.newValue >= MEMBER_TASK_ROLES.DEVELOPER && cellParams.newValue <= MEMBER_TASK_ROLES.REVIEWER)) {
                        this.updateSprintTaskMember(cellParams);
                    }
                }
            },
            {
                headerName: 'Sprint Points',
                field: 'SprintPoints',
                editable: (params: IsColumnFuncParams) => isSprintEditable && params.data.Current,
                minWidth: 100,
                valueParser: 'Number(newValue)',
                cellEditor: 'numericEditor',
                valueFormatter: (cellParams) => cellParams.data.Current ? this.utils.formatFloat(cellParams.value) : 0,
                onCellValueChanged: (cellParams: NewValueParams) => {
                    const valueChange = cellParams.newValue - cellParams.oldValue;
                    const newStoryPoints = this.totalTaskPoints + valueChange;
                    if (cellParams.newValue !== cellParams.oldValue) {
                        if (newStoryPoints > this.taskDetails.Estimate) {
                            this.snackBar.open(
                                API_RESPONSE_MESSAGES.issueStoryPointsEstimatesError,
                                '', {duration: SNACKBAR_DURATION});
                            this.revertCellValue(cellParams);
                        } else if (cellParams.newValue < 0) {
                            this.snackBar.open(
                                API_RESPONSE_MESSAGES.issueStoryPointsNegativeError,
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
                suppressKeyboardEvent: (event: SuppressKeyboardEventParams) => this.utils.isAgGridEditingEvent(event)
            },
            {
                headerName: 'Sprint Hours',
                field: 'SprintTime',
                valueFormatter: (cellParams) => cellParams.data.Current ? this.utils.formatFloat(cellParams.value / 60) : 0,
                minWidth: 100
            },
            {
                headerName: 'Total Points',
                field: 'TotalPoints',
                minWidth: 100,
                valueFormatter: (cellParams) => this.utils.formatFloat(cellParams.value)
            },
            {
                headerName: 'Total Hours',
                field: 'TotalTime',
                valueFormatter: (params) => this.utils.formatFloat(params.value / 60),
                minWidth: 100
            },
            {
                headerName: 'Rating',
                field: 'Rating',
                minWidth: 110,
                editable: (params: IsColumnFuncParams) => isSprintEditable && params.data.Current,
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
                cellRendererParams: (cellParams) => {
                    if (!cellParams.data.Current) {
                        cellParams.value = -1;
                    }
                    return cellParams;
                },
                onCellValueChanged: (cellParams: NewValueParams) => {
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
                editable: (params: IsColumnFuncParams) => isSprintEditable && params.data.Current,
                cellEditor: 'agLargeTextCellEditor',
                cellEditorParams: {
                    maxLength: 1000
                },
                valueFormatter: (cellParams) => cellParams.data.Current ? cellParams.value : '',
                onCellValueChanged: (cellParams: NewValueParams) => {
                    if (cellParams.newValue !== cellParams.oldValue) {
                        this.updateSprintTaskMember(cellParams);
                    }
                },
                suppressKeyboardEvent: (event: SuppressKeyboardEventParams) => this.utils.isAgGridEditingEvent(event)
            }
        ];
    }

    getDisplayedRowCount() {
        return (this.gridApi && this.gridApi.getDisplayedRowCount()) || 0;
    }

    toggleDescriptionView() {
        this.expandedDescHidden = !this.expandedDescHidden;
    }
}
