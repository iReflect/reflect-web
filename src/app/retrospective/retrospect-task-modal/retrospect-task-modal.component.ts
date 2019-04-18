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
    RETRO_MODAL_TYPES,
    SNACKBAR_DURATION,
    COMPACT_SUMMARY_MAX_LENGTH
} from '@constants/app-constants';
import { NumericCellEditorComponent } from 'app/shared/ag-grid-editors/numeric-cell-editor/numeric-cell-editor.component';
import { SelectCellEditorComponent } from 'app/shared/ag-grid-editors/select-cell-editor/select-cell-editor.component';
import { RatingRendererComponent } from 'app/shared/ag-grid-renderers/rating-renderer/rating-renderer.component';
import { RetrospectiveService } from 'app/shared/services/retrospective.service';
import { GridService } from 'app/shared/services/grid.service';
import { UtilsService } from 'app/shared/utils/utils.service';
import {
    CellClassParams, IsColumnFuncParams, NewValueParams,
    SuppressKeyboardEventParams
} from 'ag-grid/src/ts/entities/colDef';
import { AfterViewChecked } from '@angular/core/src/metadata/lifecycle_hooks';
import { AppConfig } from 'app/app.config';

@Component({
    selector: 'app-retrospect-task-modal',
    templateUrl: './retrospect-task-modal.component.html',
    styleUrls: ['./retrospect-task-modal.component.scss']
})
export class RetrospectTaskModalComponent implements OnDestroy, AfterViewChecked {
    sprintMembers: any;
    retrospectiveID: any;
    taskDetails: any;
    selectedMemberID: number;
    gridOptions: GridOptions;
    enableRefresh: boolean;
    autoRefreshCurrentState: boolean;
    issueDescriptionHTML: string;
    // To ignore column states updation in angular scope when grid is initialized
    columnSavingFlag = false;

    memberIDs = [];
    ratingStates = RATING_STATES;
    overlayLoadingTemplate = '<span class="ag-overlay-loading-center">Please wait while the Issue Members are loading!</span>';
    overlayNoRowsTemplate = '<span>No Members for this Issue!</span>';
    expandedDescHidden = true;
    allowDescViewToggle = true;
    // If the height of the description section is not more than 40px (since 40 is the max-height for description section,
    // we won't show "Show More" and/or "Show Less" buttons.
    descMaxHeight = 40;
    compactSummary: string;

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
        private gridService: GridService,
        public dialogRef: MatDialogRef<RetrospectTaskModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.enableRefresh = data.enableRefresh;
        this.autoRefreshCurrentState = data.enableRefresh;
        this.taskDetails = data.taskDetails;
        this.retrospectiveID = data.retrospectiveID;
        this.compactSummary = this.taskDetails.Summary;
        if (this.compactSummary.length > COMPACT_SUMMARY_MAX_LENGTH) {
            this.compactSummary = this.compactSummary.slice(0, COMPACT_SUMMARY_MAX_LENGTH) + '...';
        }
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
        if (issueDescElement) {
            setTimeout(() => {
                this.allowDescViewToggle = (issueDescElement.offsetHeight >= this.descMaxHeight);
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
                        '', { duration: SNACKBAR_DURATION });
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
            suppressScrollOnNewData: true,
            onColumnVisible: (event) => this.gridApi.sizeColumnsToFit(),
            // this event is triggered when there is change in grid columns
            onDisplayedColumnsChanged: (event) => {
                this.saveColumnState(event.columnApi.getColumnState());
            },
        };
        if (AppConfig.settings.useAgGridEnterprise) {
            this.gridOptions.enableFilter = true;
            this.gridOptions.enableSorting = true;
            this.gridOptions.floatingFilter = true;
            this.gridOptions.toolPanelSuppressPivotMode = true;
            this.gridOptions.toolPanelSuppressRowGroups = true;
            this.gridOptions.toolPanelSuppressValues = true;
        }
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
                    this.applyColumnState();
                }
            });
        this.applyColumnState();
    }

    getSprintTaskMemberSummary(isRefresh = false, isAutoRefresh = false) {
        this.saveFilterState();
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
                            '', { duration: SNACKBAR_DURATION });
                    } else {
                        this.snackBar.open(
                            this.utils.getApiErrorMessage(err) || API_RESPONSE_MESSAGES
                                .getSprintIssueMemberSummaryError,
                            '', { duration: SNACKBAR_DURATION });
                        this.dialogRef.close();
                    }
                }
            );
        // To restore columns state on refresh
        if (isRefresh) {
            this.applyColumnState();
        }
        this.restoreFilterState();
        return getTaskMemberSummary$;

    }

    refreshIssueMemberSummaryAgGrid() {
        this.gridApi.showLoadingOverlay();
        // To clear the current content of the grid
        this.gridApi.setRowData(null);
        const getTaskMemberSummary$ = this.getSprintTaskMemberSummary(true);
        getTaskMemberSummary$.subscribe(
            () => { },
            () => { },
            () => this.gridApi.hideOverlay()
        );
    }


    addNewSprintTaskMember() {
        if (this.selectedMemberID === undefined) {
            this.snackBar.open(
                API_RESPONSE_MESSAGES.memberNotSelectedError,
                '', { duration: SNACKBAR_DURATION });
        } else if (this.memberIDs.indexOf(this.selectedMemberID) !== -1) {
            this.snackBar.open(
                API_RESPONSE_MESSAGES.memberAlreadyPresent,
                '', { duration: SNACKBAR_DURATION });
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
                        '', { duration: SNACKBAR_DURATION });
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
                    '', { duration: SNACKBAR_DURATION });
            },
            err => {
                this.snackBar.open(
                    this.utils.getApiErrorMessage(err) || API_RESPONSE_MESSAGES.updateSprintMemberError,
                    '', { duration: SNACKBAR_DURATION });
                this.revertCellValue(params);
            }
        );
    }

    revertCellValue(params) {
        const rowData = params.data;
        rowData[params.colDef.field] = params.oldValue;
        this.gridApi.updateRowData({ update: [rowData] });
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
                valueGetter: ({ data: user }) => `${user.FirstName} ${user.LastName}`.trim(),
                minWidth: 160,
                pinned: true,
                filter: 'agSetColumnFilter',
                filterParams: {
                    newRowsAction: 'keep',
                    clearButton: true,
                },
            },
            {
                headerName: 'Role',
                field: 'Role',
                minWidth: 110,
                valueFormatter: (cellParams) => {
                    if (cellParams.data) {
                        return cellParams.data.Current ? MEMBER_TASK_ROLES_LABEL[cellParams.value] : '';
                    }
                    return MEMBER_TASK_ROLES_LABEL[cellParams.value];
                },
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
                },
                filter: 'agSetColumnFilter',
                filterParams: {
                    newRowsAction: 'keep',
                    suppressMiniFilter: true,
                    clearButton: true,
                    values: Object.keys(MEMBER_TASK_ROLES_LABEL).sort(),
                },
            },
            {
                headerName: 'Sprint Points',
                field: 'SprintPoints',
                editable: (params: IsColumnFuncParams) => isSprintEditable && params.data.Current,
                minWidth: 100,
                valueParser: 'Number(newValue)',
                cellEditor: 'numericEditor',
                valueFormatter: (cellParams) => {
                    if (cellParams.data) {
                        return cellParams.data.Current ? this.utils.formatFloat(cellParams.value) : 0;
                    }
                },
                onCellValueChanged: (cellParams: NewValueParams) => {
                    const valueChange = cellParams.newValue - cellParams.oldValue;
                    const newStoryPoints = this.totalTaskPoints + valueChange;
                    if (cellParams.newValue !== cellParams.oldValue) {
                        if (newStoryPoints > this.taskDetails.Estimate) {
                            this.snackBar.open(
                                API_RESPONSE_MESSAGES.issueStoryPointsEstimatesError,
                                '', { duration: SNACKBAR_DURATION });
                            this.revertCellValue(cellParams);
                        } else if (cellParams.newValue < 0) {
                            this.snackBar.open(
                                API_RESPONSE_MESSAGES.issueStoryPointsNegativeError,
                                '', { duration: SNACKBAR_DURATION });
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
                suppressKeyboardEvent: (event: SuppressKeyboardEventParams) => this.utils.isAgGridEditingEvent(event),
                suppressFilter: true,
            },
            {
                headerName: 'Sprint Hours',
                field: 'SprintTime',
                valueFormatter: (cellParams) => {
                    if (cellParams.data) {
                        return cellParams.data.Current ? this.utils.formatFloat(cellParams.value / 60) : 0;
                    }
                },
                minWidth: 100,
                suppressFilter: true,
            },
            {
                headerName: 'Total Points',
                field: 'TotalPoints',
                minWidth: 100,
                valueFormatter: (cellParams) => {
                    if (cellParams.data) {
                        return this.utils.formatFloat(cellParams.value);
                    }
                },
                suppressFilter: true,
            },
            {
                headerName: 'Total Hours',
                field: 'TotalTime',
                valueFormatter: (cellParams) => {
                    if (cellParams.data) {
                        return this.utils.formatFloat(cellParams.value / 60);
                    }
                },
                minWidth: 100,
                suppressFilter: true,
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
                },
                filter: 'agSetColumnFilter',
                filterParams: {
                    cellRenderer: 'ratingRenderer',
                    newRowsAction: 'keep',
                    suppressMiniFilter: true,
                    clearButton: true,
                    values: Object.keys(RATING_STATES_LABEL).sort()
                },
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
                valueFormatter: (cellParams) => {
                    if (cellParams.data) {
                        return cellParams.data.Current ? cellParams.value : '';
                    }
                },
                onCellValueChanged: (cellParams: NewValueParams) => {
                    if (cellParams.newValue !== cellParams.oldValue) {
                        this.updateSprintTaskMember(cellParams);
                    }
                },
                suppressKeyboardEvent: (event: SuppressKeyboardEventParams) => this.utils.isAgGridEditingEvent(event),
                filter: 'agTextColumnFilter',
                filterParams: {
                    newRowsAction: 'keep',
                    clearButton: true,
                },
            }
        ];
    }

    getDisplayedRowCount() {
        return (this.gridApi && this.gridApi.getDisplayedRowCount()) || 0;
    }

    toggleDescriptionView() {
        this.expandedDescHidden = !this.expandedDescHidden;
    }

    clearFilters() {
        if (this.gridApi) {
            this.gridApi.setFilterModel(null);
            this.gridApi.onFilterChanged();
            this.saveFilterState();
        }
    }
    // To save the columns current state in grid service
    saveColumnState(columnState: any) {
        // To ignore saving of column states when first time grid is initialized
        if (this.columnSavingFlag) {
            this.gridService.saveColumnState(this.retrospectiveID, RETRO_MODAL_TYPES.TASK, columnState);
        }
        this.columnSavingFlag = true;
    }
    // To restore the saved column states from grid service
    applyColumnState() {
        const savedColumnState = this.gridService.getColumnState(this.retrospectiveID, RETRO_MODAL_TYPES.TASK);
        // To check if there is any saved column state for this table
        // if present then apply to grid
        if (savedColumnState && savedColumnState.length > 0) {
            this.columnApi.setColumnState(savedColumnState);
        }
    }
    // To save the states of column filters in grid service
    saveFilterState() {
        this.gridService.saveFilterState(RETRO_MODAL_TYPES.TASK, this.gridApi.getFilterModel());
    }
    // To restore the saved state of column filters from grid service
    restoreFilterState() {
        this.gridApi.setFilterModel(this.gridService.getFilterState(RETRO_MODAL_TYPES.TASK));
    }

}
