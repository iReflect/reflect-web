import { Component, EventEmitter, HostListener, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { MatDialogRef } from '@angular/material/dialog/typings/dialog-ref';
import { ColumnApi, GridApi, GridOptions } from 'ag-grid';
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/finally';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import {
    API_RESPONSE_MESSAGES,
    AUTO_REFRESH_DURATION,
    RETRO_FEEDBACK_TYPES,
    RETRO_SUMMARY_TYPES,
    RATING_STATES,
    RATING_STATES_LABEL,
    SNACKBAR_DURATION,
    SPRINT_STATES
} from '@constants/app-constants';
import {
    ClickableButtonRendererComponent
} from 'app/shared/ag-grid-renderers/clickable-button-renderer/clickable-button-renderer.component';
import { RetrospectiveService } from 'app/shared/services/retrospective.service';
import { RetrospectTaskModalComponent } from 'app/retrospective/retrospect-task-modal/retrospect-task-modal.component';
import { UtilsService } from 'app/shared/utils/utils.service';
import { BasicModalComponent } from 'app/shared/basic-modal/basic-modal.component';
import * as _ from 'lodash';
import { SelectCellEditorComponent } from 'app/shared/ag-grid-editors/select-cell-editor/select-cell-editor.component';
import { RatingRendererComponent } from 'app/shared/ag-grid-renderers/rating-renderer/rating-renderer.component';
import { AppConfig } from 'app/app.config';
import { GridService } from 'app/shared/services/grid.service';
@Component({
    selector: 'app-sprint-task-summary',
    templateUrl: './sprint-task-summary.component.html',
    styleUrls: ['./sprint-task-summary.component.scss']
})
export class SprintTaskSummaryComponent implements OnInit, OnChanges, OnDestroy {
    gridOptions: GridOptions;
    dialogRef: MatDialogRef<any>;
    autoRefreshCurrentState: boolean;
    ratingStates = RATING_STATES;
    overlayLoadingTemplate = '<span class="ag-overlay-loading-center">Please wait while the Issues are loading!</span>';
    overlayNoRowsTemplate = '<span>No Issues in this sprint!</span>';
    // To ignore column data updation in angular scope when grid is intialized
    setColumnflag: boolean;

    @Input() retrospectiveID;
    @Input() sprintID;
    @Input() sprintStatus;
    @Input() isTabActive: boolean;
    @Input() enableRefresh: boolean;
    @Input() refreshOnChange: boolean;
    @Input() sprintEndDate: any;
    @Input() isSprintEditable: boolean;

    @Output() onRefreshStart = new EventEmitter<boolean>();
    @Output() onRefreshEnd = new EventEmitter<boolean>();
    @Output() refreshSprintDetails = new EventEmitter();

    private params: any;
    private columnDefs: any;
    private gridApi: GridApi;
    private columnApi: ColumnApi;
    private doneFlag = false;
    private destroy$: Subject<boolean> = new Subject<boolean>();

    constructor(
        private snackBar: MatSnackBar,
        public dialog: MatDialog,
        private retrospectiveService: RetrospectiveService,
        private gridService: GridService,
        private utils: UtilsService
    ) {
    }

    @HostListener('window:resize') onResize() {
        if (this.gridApi && this.isTabActive) {
            setTimeout(() => {
                this.gridApi.sizeColumnsToFit();
            });
        }
    }

    ngOnInit(): void {
        this.columnDefs = this.createColumnDefs(this.sprintStatus, this.isSprintEditable);
        this.setColumnflag = false;
        this.setGridOptions();
        this.autoRefreshCurrentState = this.enableRefresh;
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.enableRefresh) {
            this.autoRefreshCurrentState = changes.enableRefresh.currentValue;
        }
        if (changes.sprintStatus) {
            this.columnDefs = this.createColumnDefs(changes.sprintStatus.currentValue, this.isSprintEditable);
            if (this.gridApi) {
                this.gridApi.setColumnDefs(this.columnDefs);
                this.applyColumnState();
            }
        }
        if (this.gridApi) {
            // this if block also executes when changes.refreshOnChange toggles
            if (this.isTabActive && !changes.isTabActive) {
                if (this.autoRefreshCurrentState) {
                    this.refreshSprintTaskSummary(true);
                }
                if (changes.refreshOnChange) {
                    this.refreshSprintTaskSummary();
                }
                this.gridApi.sizeColumnsToFit();
                this.applyColumnState();

            }
            // we do this separately because we need to wait
            // at the least one tick when this tab is made active
            if (changes.isTabActive && changes.isTabActive.currentValue) {
                setTimeout(() => {
                    this.refreshSprintTaskSummary();
                    this.applyColumnState();
                    this.gridApi.sizeColumnsToFit();
                });
            }
            if (changes.isTabActive && !changes.isTabActive.currentValue) {
                this.saveFilterState();
            }
        }
    }

    ngOnDestroy() {
        this.autoRefreshCurrentState = false;
        this.destroy$.next(true);
        this.destroy$.complete();
        if (this.dialogRef) {
            this.dialogRef.close();
        }
    }

    onCellEditingStarted() {
        this.autoRefreshCurrentState = false;
    }

    setGridOptions() {
        this.gridOptions = <GridOptions>{
            columnDefs: this.columnDefs,
            defaultColDef: {
                width: 10,
            },
            frameworkComponents: {
                'ratingEditor': SelectCellEditorComponent,
                'ratingRenderer': RatingRendererComponent,
                'clickableButtonRenderer': ClickableButtonRendererComponent
            },
            onCellEditingStarted: () => this.onCellEditingStarted(),
            onGridReady: event => this.onGridReady(event),
            overlayLoadingTemplate: this.overlayLoadingTemplate,
            overlayNoRowsTemplate: this.overlayNoRowsTemplate,
            rowClassRules: {
                'invalid-ag-grid-row': (params) => {
                    return params.data.IsInvalid;
                }
            },
            rowHeight: 48,
            singleClickEdit: true,
            suppressDragLeaveHidesColumns: true,
            suppressScrollOnNewData: true,
            stopEditingWhenGridLosesFocus: true,
            onColumnVisible: (event) => this.gridApi.sizeColumnsToFit(),
            // this event is triggred when there is change in grid columns
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
        if (this.isTabActive) {
            this.getSprintTaskSummary().subscribe();
            this.gridApi.sizeColumnsToFit();
        }
        Observable.interval(AUTO_REFRESH_DURATION)
            .takeUntil(this.destroy$)
            .subscribe(() => {
                if (this.isTabActive && this.autoRefreshCurrentState) {
                    this.refreshSprintTaskSummary(true);
                    this.applyColumnState();
                }
            });
        this.applyColumnState();
    }

    refreshSprintTaskSummary(isAutoRefresh = false) {
        if (!isAutoRefresh) {
            this.onRefreshStart.emit(true);
        }
        this.getSprintTaskSummary(true, isAutoRefresh)
            .finally(() => {
                if (!isAutoRefresh) {
                    this.onRefreshEnd.emit(true);
                }
            })
            .subscribe();
    }

    getSprintTaskSummary(isRefresh = false, isAutoRefresh = false) {
        this.saveFilterState();
        return this.retrospectiveService.getSprintTaskSummary(this.retrospectiveID, this.sprintID, isAutoRefresh)
            .takeUntil(this.destroy$)
            .do(
                response => {
                    this.gridApi.setRowData(response.data.Tasks);
                    if (!isRefresh && this.isTabActive) {
                        setTimeout(() => {
                            this.gridApi.sizeColumnsToFit();
                        });
                    }
                },
                err => {
                    if (isRefresh) {
                        this.snackBar.open(
                            API_RESPONSE_MESSAGES.issueSummaryRefreshFailure,
                            '', { duration: SNACKBAR_DURATION });
                    } else {
                        this.snackBar.open(
                            this.utils.getApiErrorMessage(err) || API_RESPONSE_MESSAGES
                                .getSprintIssueSummaryError,
                            '', { duration: SNACKBAR_DURATION });
                    }
                },
                () => {
                    this.restoreFilterData();
                    this.autoRefreshCurrentState = this.enableRefresh;
                }
            );
    }

    retrospectSprint(params) {
        const sprintTaskSummaryData = params.data;
        this.autoRefreshCurrentState = false;
        this.dialogRef = this.dialog.open(RetrospectTaskModalComponent, {
            width: '90%',
            autoFocus: false,
            data: {
                taskDetails: sprintTaskSummaryData,
                sprintID: this.sprintID,
                retrospectiveID: this.retrospectiveID,
                sprintStatus: this.sprintStatus,
                enableRefresh: this.enableRefresh,
                isSprintEditable: this.isSprintEditable,
            },
        });
        this.dialogRef.afterClosed().takeUntil(this.destroy$).subscribe(() => {
            this.refreshSprintTaskSummary();
            this.autoRefreshCurrentState = this.enableRefresh;
        });
    }

    updateSprintTask(params) {
        const updatedSprintTaskData = {
            [params.colDef.field]: params.newValue
        };
        this.retrospectiveService.updateSprintTask(this.retrospectiveID, this.sprintID, params.data.ID, updatedSprintTaskData)
            .takeUntil(this.destroy$)
            .subscribe(
                response => {
                    params.node.setData(response.data);
                    this.snackBar.open(
                        API_RESPONSE_MESSAGES.issueUpdated,
                        '', { duration: SNACKBAR_DURATION });
                },
                err => {
                    this.snackBar.open(
                        this.utils.getApiErrorMessage(err) || API_RESPONSE_MESSAGES.updateSprintTaskError,
                        '', { duration: SNACKBAR_DURATION });
                    this.revertCellValue(params);
                }
            );
    }

    revertCellValue(params) {
        const rowData = params.data;
        rowData[params.colDef.field] = params.oldValue;
        this.gridApi.updateRowData({ update: [rowData] });
    }

    private createColumnDefs(sprintStatus, isSprintEditable) {
        let markedDoneColumns = [];
        if ([SPRINT_STATES.DRAFT, SPRINT_STATES.FROZEN].indexOf(sprintStatus) === -1) {
            markedDoneColumns = [
                {
                    headerName: 'Done',
                    headerClass: 'custom-ag-grid-header task-summary-done-icon-header',
                    colId: 'markDone',
                    cellRenderer: 'clickableButtonRenderer',
                    cellRendererParams: (params) => {
                        return {
                            useIcon: true,
                            color: 'primary',
                            icon: (params.data.DoneAt || this.doneFlag) ? 'check_box' : 'check_box_outline_blank',
                            onClick: this.markDoneUnDone.bind(this),
                        };
                    },
                    pinned: true,
                    minWidth: 100,
                    suppressMenu: true,
                    suppressFilter: true,
                    comparator: (valueA, valueB, nodeA, nodeB, isInverted) => {
                        return !isInverted;
                    }
                }
            ];
        }
        return [
            ...markedDoneColumns,
            {
                headerName: 'Retrospect',
                headerClass: 'custom-ag-grid-header task-summary-retrospect-icon-header',
                cellRenderer: 'clickableButtonRenderer',
                cellRendererParams: {
                    useIcon: true,
                    color: 'primary',
                    icon: 'rate_review',
                    onClick: this.retrospectSprint.bind(this)
                },
                pinned: true,
                minWidth: 100,
                suppressSorting: true,
                suppressFilter: true,
            },
            {
                headerName: 'ID',
                headerClass: 'custom-ag-grid-header task-summary-id-header',
                field: 'Key',
                tooltipField: 'Key',
                minWidth: 130,
                pinned: true,
                filter: 'agSetColumnFilter',
                filterParams: {
                    newRowsAction: 'keep',
                    clearButton: true,
                },
                cellRenderer: (params) => {
                    if (!params.data.IsTrackerTask || !params.data.URL) {
                        return params.data.Key;
                    }
                    return `<a class="custom-ag-grid-anchor-cell" target="_blank" href="${params.data.URL}">${params.data.Key}</a>`;
                }
            },
            {
                headerName: 'Summary',
                headerClass: 'custom-ag-grid-header',
                field: 'Summary',
                pinned: true,
                minWidth: 300,
                maxWidth: 500,
                tooltipField: 'Summary',
                filter: 'agTextColumnFilter',
                filterParams: {
                    newRowsAction: 'keep',
                    clearButton: true,
                },
            },
            {
                headerName: 'Assignee',
                field: 'Assignee',
                tooltipField: 'Assignee',
                minWidth: 160,
                filter: 'agTextColumnFilter',
                filterParams: {
                    newRowsAction: 'keep',
                    clearButton: true,
                },
            },
            {
                headerName: 'Owner',
                field: 'Owner',
                tooltipField: 'Owner',
                minWidth: 160,
                filter: 'agTextColumnFilter',
                filterParams: {
                    newRowsAction: 'keep',
                    clearButton: true,
                },
            },
            {
                headerName: 'Participants',
                field: 'TaskParticipants',
                tooltipField: 'TaskParticipants',
                minWidth: 160,
                hide: true,
                filter: 'agTextColumnFilter',
                filterParams: {
                    newRowsAction: 'keep',
                    clearButton: true,
                },
            },
            {
                headerName: 'Sprint Owner',
                field: 'SprintOwner',
                tooltipField: 'SprintOwner',
                minWidth: 160,
                hide: true,
                filter: 'agTextColumnFilter',
                filterParams: {
                    newRowsAction: 'keep',
                    clearButton: true,
                },
            },
            {
                headerName: 'Sprint Participants',
                field: 'SprintParticipants',
                tooltipField: 'SprintParticipants',
                minWidth: 160,
                hide: true,
                filter: 'agTextColumnFilter',
                filterParams: {
                    newRowsAction: 'keep',
                    clearButton: true,
                },
            },
            {
                headerName: 'Type',
                headerClass: 'custom-ag-grid-header',
                field: 'Type',
                minWidth: 120,
                filter: 'agSetColumnFilter',
                filterParams: {
                    newRowsAction: 'keep',
                    clearButton: true,
                },
            },
            {
                headerName: 'Status',
                headerClass: 'custom-ag-grid-header',
                field: 'Status',
                minWidth: 110,
                filter: 'agSetColumnFilter',
                filterParams: {
                    newRowsAction: 'keep',
                    clearButton: true,
                },
            },
            {
                headerName: 'Rating',
                headerClass: 'custom-ag-grid-header',
                field: 'Rating',
                minWidth: 120,
                editable: isSprintEditable,
                cellEditor: 'ratingEditor',
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
                        this.updateSprintTask(cellParams);
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
                headerName: 'Points',
                headerClass: 'custom-ag-grid-header',
                field: 'Estimate',
                minWidth: 120,
                suppressFilter: true,
                valueFormatter: (cellParams) => this.utils.formatFloat(cellParams.value)
            },
            {
                headerName: 'Sprint Points',
                headerClass: 'custom-ag-grid-header',
                field: 'PointsEarned',
                valueFormatter: (cellParams) => this.utils.formatFloat(cellParams.value),
                minWidth: 120,
                suppressFilter: true,
            },
            {
                headerName: 'Total Points Earned',
                headerClass: 'custom-ag-grid-header task-summary-long-header',
                field: 'TotalPointsEarned',
                valueFormatter: (cellParams) => this.utils.formatFloat(cellParams.value),
                minWidth: 120,
                suppressFilter: true,
            },
            {
                headerName: 'Sprint Hours',
                headerClass: 'custom-ag-grid-header',
                field: 'SprintTime',
                valueFormatter: (cellParams) => this.utils.formatFloat(cellParams.value / 60),
                minWidth: 120,
                suppressFilter: true,
            },
            {
                headerName: 'Sprint Owner Hours',
                headerClass: 'custom-ag-grid-header task-summary-long-header',
                field: 'SprintOwnerTime',
                hide: true,
                valueFormatter: (cellParams) => this.utils.formatFloat(cellParams.value / 60),
                minWidth: 120,
                suppressFilter: true,
            },
            {
                headerName: 'Total Hours',
                headerClass: 'custom-ag-grid-header',
                field: 'TotalTime',
                valueFormatter: (cellParams) => this.utils.formatFloat(cellParams.value / 60),
                minWidth: 120,
                suppressFilter: true,
            },
            {
                headerName: 'Total Owner Hours',
                headerClass: 'custom-ag-grid-header task-summary-long-header',
                field: 'SprintOwnerTotalTime',
                hide: true,
                valueFormatter: (cellParams) => this.utils.formatFloat(cellParams.value / 60),
                minWidth: 120,
                suppressFilter: true,
            },
            {
                headerName: 'Done At',
                field: 'DoneAt',
                minWidth: 170,
                valueFormatter: (params) => this.utils.getDateFromString(params.value || ''),
                filter: 'agDateColumnFilter',
                filterParams: {
                    newRowsAction: 'keep',
                    clearButton: true,
                    suppressAndOrCondition: true,
                    comparator: (dateFilterValue, cellValue) => {
                        const cellDateValue = new Date(cellValue);
                        if (cellDateValue < dateFilterValue) {
                            return -1;
                        } else if (cellDateValue > dateFilterValue) {
                            return 1;
                        }
                        return 0;
                    },
                },
            },
        ];
    }

    getDisplayedRowCount() {
        return (this.gridApi && this.gridApi.getDisplayedRowCount()) || 0;
    }

    markDoneUnDone(params) {
        const sprintTaskSummaryData = params.data;
        if (sprintTaskSummaryData.DoneAt) {
            let currentDoneAt;
            const dialogRef = this.dialog.open(BasicModalComponent, {
                data: {
                    content: 'Are you sure you want to mark this issue as Undone?',
                    confirmBtn: 'Yes',
                    cancelBtn: 'Cancel'
                },
                disableClose: true
            });

            dialogRef.afterClosed().takeUntil(this.destroy$).subscribe(result => {
                if (result) {
                    currentDoneAt = sprintTaskSummaryData.DoneAt;
                    sprintTaskSummaryData.DoneAt = null;
                    params.node.setData(sprintTaskSummaryData);
                    // Refresh the Mark Done/Undone cell to reflect the change in the 'Done' icon
                    params.refreshCell({ suppressFlash: false, newData: false, forceRefresh: true });
                    this.retrospectiveService.markSprintTaskUnDone(this.retrospectiveID, this.sprintID, sprintTaskSummaryData.ID)
                        .takeUntil(this.destroy$)
                        .subscribe(
                            response => {
                                const sprintTaskSummary = response.data;
                                params.node.setData(sprintTaskSummary);
                                // Refresh the Mark Done/Undone cell to reflect the change in the 'Done' icon
                                params.refreshCell({ suppressFlash: false, newData: false, forceRefresh: true });
                                this.snackBar.open(API_RESPONSE_MESSAGES.getSprintIssueMarkedUndoneSuccess,
                                    '', { duration: SNACKBAR_DURATION });
                                this.refreshSprintDetails.emit();
                            },
                            err => {
                                sprintTaskSummaryData.DoneAt = currentDoneAt;
                                params.node.setData(sprintTaskSummaryData);
                                // Refresh the Mark Done/Undone cell to reflect the change in the 'Done' icon
                                params.refreshCell({ suppressFlash: false, newData: false, forceRefresh: true });
                                this.snackBar.open(this.utils.getApiErrorMessage(err) || API_RESPONSE_MESSAGES.error,
                                    '', { duration: SNACKBAR_DURATION });
                            }
                        );
                }
            });
        } else {
            this.doneFlag = true;
            // Refresh the Mark Done/Undone cell to reflect the change in the 'Done' icon
            params.refreshCell({ suppressFlash: false, newData: false, forceRefresh: true });
            this.retrospectiveService.markSprintTaskDone(this.retrospectiveID, this.sprintID, sprintTaskSummaryData.ID)
                .takeUntil(this.destroy$)
                .subscribe(
                    response => {
                        const sprintTaskSummary = response.data;
                        params.node.setData(sprintTaskSummary);
                        this.doneFlag = false;
                        // Refresh the Mark Done/Undone cell to reflect the change in the 'Done' icon
                        params.refreshCell({ suppressFlash: false, newData: false, forceRefresh: true });
                        this.snackBar.open(API_RESPONSE_MESSAGES.getSprintIssueMarkedDoneSuccess, '', { duration: SNACKBAR_DURATION });
                        this.refreshSprintDetails.emit();
                    },
                    err => {
                        sprintTaskSummaryData.DoneAt = null;
                        this.doneFlag = false;
                        params.node.setData(sprintTaskSummaryData);
                        // Refresh the Mark Done/Undone cell to reflect the change in the 'Done' icon
                        params.refreshCell({ suppressFlash: false, newData: false, forceRefresh: true });
                        this.snackBar.open(this.utils.getApiErrorMessage(err) || API_RESPONSE_MESSAGES.error,
                            '', { duration: SNACKBAR_DURATION });
                    }
                );
        }
    }

    clearFilters() {
        if (this.gridApi) {
            this.gridApi.setFilterModel(null);
            this.gridApi.onFilterChanged();
            this.saveFilterState();
        }
    }
    // TO save the states of column filters
    saveFilterState() {
        this.gridService.saveFilterState(RETRO_SUMMARY_TYPES.TASK, this.gridApi.getFilterModel());
    }
    // restore the state column filters
    restoreFilterData() {
        this.gridApi.setFilterModel(this.gridService.getFilterState(RETRO_SUMMARY_TYPES.TASK));
    }
    // To save the current state of columns in angular scope
    saveColumnState(columnState: any) {
        if (this.setColumnflag && this.isTabActive) {
            this.gridService.saveColumnState(this.retrospectiveID, RETRO_SUMMARY_TYPES.TASK, columnState);
        }
        this.setColumnflag = true;
    }
    // To restore the saved state of columns
    applyColumnState() {
        const columnState = this.gridService.getColumnState(this.retrospectiveID, RETRO_SUMMARY_TYPES.TASK);
        if (columnState && columnState.length > 0) {
            this.columnApi.setColumnState(columnState);
        }

    }
}
