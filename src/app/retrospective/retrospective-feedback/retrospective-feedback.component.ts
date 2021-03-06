import {
    Component, EventEmitter, HostListener, Input, OnChanges, OnDestroy, OnInit, Output,
    SimpleChanges
} from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { ColumnApi, GridApi, GridOptions } from 'ag-grid';
import * as _ from 'lodash';

import {
    API_RESPONSE_MESSAGES,
    RETRO_FEEDBACK_GOAL_TYPES,
    RETRO_FEEDBACK_SCOPE_LABELS,
    RETRO_FEEDBACK_SCOPE_TYPES,
    RETRO_FEEDBACK_TYPES,
    SNACKBAR_DURATION,
    SPRINT_STATES
} from '@constants/app-constants';
import { SelectCellEditorComponent } from 'app/shared/ag-grid-editors/select-cell-editor/select-cell-editor.component';
import { DatePickerEditorComponent } from 'app/shared/ag-grid-editors/date-picker-editor/date-picker-editor.component';
import { ClickableButtonRendererComponent } from 'app/shared/ag-grid-renderers/clickable-button-renderer/clickable-button-renderer.component';
import { BasicModalComponent } from 'app/shared/basic-modal/basic-modal.component';
import { GridService } from 'app/shared/services/grid.service';
import { RetrospectiveService } from 'app/shared/services/retrospective.service';
import { UtilsService } from 'app/shared/utils/utils.service';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';
import { AppConfig } from 'app/app.config';
import { SuppressKeyboardEventParams } from 'ag-grid/src/ts/entities/colDef';

@Component({
    selector: 'app-retrospective-feedback',
    templateUrl: './retrospective-feedback.component.html',
    styleUrls: ['./retrospective-feedback.component.scss']
})
export class RetrospectiveFeedbackComponent implements OnInit, OnChanges, OnDestroy {
    gridOptions: GridOptions;
    sprintStates = SPRINT_STATES;
    goalTypes = RETRO_FEEDBACK_GOAL_TYPES;
    // To ignore column states updation two times when grid is initialized and data is inserted in the grid
    skipColumnPreservationCounter = 2;
    @Input() title;
    @Input() retrospectiveID;
    @Input() sprintID;
    @Input() sprintStatus;
    @Input() sprintEndDate;
    @Input() isTabActive;
    @Input() feedbackType: number;
    @Input() feedbackSubType;
    @Input() data: any;
    @Input() teamMembers: any;
    @Input() enableRefresh: boolean;

    @Output() resumeRefresh = new EventEmitter();
    @Output() pauseRefresh = new EventEmitter();
    @Output() refreshRetrospectiveFeedbacks = new EventEmitter();

    private columnDefs: any;
    private params: any;
    private gridApi: GridApi;
    private columnApi: ColumnApi;
    private destroy$: Subject<boolean> = new Subject<boolean>();

    @HostListener('window:resize')
    onResize() {
        this.resizeAgGrid();
    }

    @HostListener('window:scroll', [])
    onWindowScroll() {
        this.resizeAgGrid();
    }

    constructor(
        private retrospectiveService: RetrospectiveService,
        private snackBar: MatSnackBar,
        private utils: UtilsService,
        public dialog: MatDialog,
        private gridService: GridService,
    ) {
    }
    ngOnInit() {
        this.columnDefs = this.createColumnDefs(this.sprintStatus, this.teamMembers);
        this.setGridOptions();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (this.gridApi) {
            if ((changes.teamMembers && changes.teamMembers.previousValue === undefined) || changes.sprintStatus) {
                this.columnDefs = this.createColumnDefs(this.sprintStatus, this.teamMembers);
                this.gridApi.setColumnDefs(this.columnDefs);
                // To restore apllied filters on sprint status changes
                this.restoreFilterState();
            }
            if (changes.data) {
                const data = changes.data.currentValue || [];
                this.gridApi.setRowData(data.filter((feedback) => (this.feedbackType === RETRO_FEEDBACK_TYPES.GOAL) ||
                    feedback.SubType === this.feedbackSubType));
            }
            if (this.isTabActive && !changes.isTabActive) {
                this.gridApi.sizeColumnsToFit();
            }
            // we do this separately because we need to wait
            // at the least one tick when this tab is made active
            if (changes.isTabActive && changes.isTabActive.currentValue) {
                this.resizeAgGrid();
            }
            this.applyColumnState();
        }
    }
    ngOnDestroy() {
        this.destroy$.next(true);
        this.destroy$.complete();
    }

    onCellEditingStarted() {
        this.pauseRefresh.emit();
    }

    onCellEditingStopped() {
        this.resumeRefresh.emit();
    }

    setGridOptions() {
        this.gridOptions = <GridOptions>{
            columnDefs: this.columnDefs,
            frameworkComponents: {
                'selectEditor': SelectCellEditorComponent,
                'clickableButtonRenderer': ClickableButtonRendererComponent,
                'datePicker': DatePickerEditorComponent,
                'deleteButtonRenderer': ClickableButtonRendererComponent,
            },
            onCellEditingStarted: () => this.onCellEditingStarted(),
            onCellEditingStopped: () => this.onCellEditingStopped(),
            onGridReady: event => {
                this.onGridReady(event);
                this.applyColumnState();
            },
            rowHeight: 48,
            singleClickEdit: true,
            stopEditingWhenGridLosesFocus: true,
            suppressDragLeaveHidesColumns: true,
            suppressScrollOnNewData: true,
            onColumnVisible: (event) => this.gridApi.sizeColumnsToFit(),
            // this event is triggred when there is change in grid columns
            onDisplayedColumnsChanged: (event) => {
                this.onDisplayedColumnsChanged(event.columnApi.getColumnState());
            },
            onFilterChanged: (event) => this.saveFilterState(),
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

        setTimeout(() => {
            if (this.data) {
                this.gridApi.setRowData(
                    this.data.filter((feedback) => this.feedbackType === RETRO_FEEDBACK_TYPES.GOAL
                        || feedback.SubType === this.feedbackSubType));
            }
            if (this.teamMembers && this.sprintStatus) {
                this.columnDefs = this.createColumnDefs(this.sprintStatus, this.teamMembers);
                this.gridApi.setColumnDefs(this.columnDefs);
                this.applyColumnState();
            }
            if (this.isTabActive) {
                this.gridApi.sizeColumnsToFit();
            }
        });
        this.applyColumnState();
    }

    resolveSprintGoal(params: any) {
        const goalData = params.data;
        const index: number = params.node.rowIndex;
        this.gridApi.updateRowData({ remove: [goalData] });
        this.retrospectiveService.resolveSprintGoal(this.retrospectiveID, this.sprintID, goalData.ID)
            .takeUntil(this.destroy$)
            .subscribe(
                () => {
                    this.refreshRetrospectiveFeedbacks.emit();
                    this.snackBar.open(API_RESPONSE_MESSAGES.goalResolvedSuccessfully, '', { duration: SNACKBAR_DURATION });
                },
                err => {
                    this.gridApi.updateRowData({ add: [goalData], addIndex: index });
                    this.snackBar.open(
                        this.utils.getApiErrorMessage(err) || API_RESPONSE_MESSAGES.goalResolveFailed,
                        '', { duration: SNACKBAR_DURATION });
                }
            );
    }

    unresolveSprintGoal(params: any) {
        const goalData = params.data;
        const index: number = params.node.rowIndex;
        this.gridApi.updateRowData({ remove: [goalData] });
        this.retrospectiveService.unresolveSprintGoal(this.retrospectiveID, this.sprintID, goalData.ID)
            .takeUntil(this.destroy$)
            .subscribe(
                () => {
                    this.refreshRetrospectiveFeedbacks.emit();
                    this.snackBar.open(API_RESPONSE_MESSAGES.goalUnResolvedSuccessfully, '', { duration: SNACKBAR_DURATION });
                },
                err => {
                    this.gridApi.updateRowData({ add: [goalData], addIndex: index });
                    this.snackBar.open(
                        this.utils.getApiErrorMessage(err) || API_RESPONSE_MESSAGES.goalUnResolveFailed,
                        '', { duration: SNACKBAR_DURATION });
                }
            );
    }

    updateRetroFeedback(params: any) {
        let assigneeIDPrevValue: any;
        const updatedRetroFeedbackData = {
            [params.colDef.field]: params.newValue
        };
        if (params.colDef.field === 'Scope') {
            assigneeIDPrevValue = params.data.AssigneeID;
            if (params.newValue === RETRO_FEEDBACK_SCOPE_TYPES.Team) {
                params.data.AssigneeID = null;
            } else {
                params.data.AssigneeID = this.teamMembers[0].ID;
                updatedRetroFeedbackData['AssigneeID'] = this.teamMembers[0].ID;
            }
            params.node.setData(params.data);
        }
        if (this.feedbackType === RETRO_FEEDBACK_TYPES.HIGHLIGHT) {
            this.retrospectiveService.updateSprintHighlight(this.retrospectiveID, this.sprintID, params.data.ID, updatedRetroFeedbackData)
                .takeUntil(this.destroy$)
                .subscribe(
                    response => {
                        params.node.setData(response.data);
                        this.snackBar.open(API_RESPONSE_MESSAGES.sprintHighlightsUpdateSuccess, '', { duration: SNACKBAR_DURATION });
                    },
                    err => {
                        this.snackBar.open(
                            this.utils.getApiErrorMessage(err) || API_RESPONSE_MESSAGES.sprintHighlightsUpdateError,
                            '', { duration: SNACKBAR_DURATION });
                        if (params.colDef.field === 'Scope') {
                            // To revert the change of assigneeID with change in Scope
                            this.revertCellValue(params, assigneeIDPrevValue);
                        } else {
                            // To revert the change of only changed field
                            this.revertCellValue(params);
                        }
                    }
                );
        } else if (this.feedbackType === RETRO_FEEDBACK_TYPES.NOTE) {
            this.retrospectiveService.updateRetroNote(this.retrospectiveID, this.sprintID, params.data.ID, updatedRetroFeedbackData)
                .takeUntil(this.destroy$)
                .subscribe(
                    response => {
                        params.node.setData(response.data);
                        this.snackBar.open(API_RESPONSE_MESSAGES.sprintNotesUpdateSuccess, '', { duration: SNACKBAR_DURATION });
                    },
                    err => {
                        this.snackBar.open(
                            this.utils.getApiErrorMessage(err) || API_RESPONSE_MESSAGES.sprintNotesUpdateError,
                            '', { duration: SNACKBAR_DURATION });
                        if (params.colDef.field === 'Scope') {
                            // To revert the change of assigneeID with change in Scope
                            this.revertCellValue(params, assigneeIDPrevValue);
                        } else {
                            // To revert the change of only changed field
                            this.revertCellValue(params);
                        }
                    }
                );
        } else if (this.feedbackType === RETRO_FEEDBACK_TYPES.GOAL) {
            this.retrospectiveService.updateRetroGoal(this.retrospectiveID, this.sprintID, params.data.ID, updatedRetroFeedbackData)
                .takeUntil(this.destroy$)
                .subscribe(
                    response => {
                        params.node.setData(response.data);
                        this.snackBar.open(API_RESPONSE_MESSAGES.sprintGoalsUpdateSuccess, '', { duration: SNACKBAR_DURATION });
                    },
                    err => {
                        this.snackBar.open(
                            this.utils.getApiErrorMessage(err) || API_RESPONSE_MESSAGES.sprintGoalsUpdateError,
                            '', { duration: SNACKBAR_DURATION });
                        if (params.colDef.field === 'Scope') {
                            // To revert the change of assigneeID with change in Scope
                            this.revertCellValue(params, assigneeIDPrevValue);
                        } else {
                            // To revert the change of only changed field
                            this.revertCellValue(params);
                        }
                    }
                );
        }
    }

    addMoreRow() {
        if (this.gridApi) {
            if (this.feedbackType === RETRO_FEEDBACK_TYPES.HIGHLIGHT) {
                this.retrospectiveService.addSprintHighlight(this.retrospectiveID, this.sprintID, this.feedbackSubType)
                    .takeUntil(this.destroy$)
                    .subscribe(
                        response => {
                            this.gridApi.updateRowData({ add: [response.data], addIndex: 0 });
                            this.snackBar.open(API_RESPONSE_MESSAGES.sprintHighlightsAddSuccess, '', { duration: SNACKBAR_DURATION });
                        },
                        err => {
                            this.snackBar.open(
                                this.utils.getApiErrorMessage(err) || API_RESPONSE_MESSAGES.sprintHighlightsAddError,
                                '', { duration: SNACKBAR_DURATION });
                        }
                    );
            } else if (this.feedbackType === RETRO_FEEDBACK_TYPES.NOTE) {
                this.retrospectiveService.addNewRetroNote(this.retrospectiveID, this.sprintID, this.feedbackSubType)
                    .takeUntil(this.destroy$)
                    .subscribe(
                        response => {
                            this.gridApi.updateRowData({ add: [response.data], addIndex: 0 });
                            this.snackBar.open(API_RESPONSE_MESSAGES.sprintNotesAddSuccess, '', { duration: SNACKBAR_DURATION });
                        },
                        err => {
                            this.snackBar.open(
                                this.utils.getApiErrorMessage(err) || API_RESPONSE_MESSAGES.sprintNotesAddError,
                                '', { duration: SNACKBAR_DURATION });
                        }
                    );
            } else if (this.feedbackType === RETRO_FEEDBACK_TYPES.GOAL) {
                this.retrospectiveService.addNewRetroGoal(this.retrospectiveID, this.sprintID)
                    .takeUntil(this.destroy$)
                    .subscribe(
                        response => {
                            this.gridApi.updateRowData({ add: [response.data], addIndex: 0 });
                            this.snackBar.open(API_RESPONSE_MESSAGES.sprintGoalsAddSuccess, '', { duration: SNACKBAR_DURATION });
                        },
                        err => {
                            this.snackBar.open(
                                this.utils.getApiErrorMessage(err) || API_RESPONSE_MESSAGES.sprintGoalsAddError,
                                '', { duration: SNACKBAR_DURATION });
                        }
                    );
            }
        }
    }
    deleteRetroFeedback(params: any) {
        const retroFeedback = params.data;
        const dialogRef = this.dialog.open(BasicModalComponent, {
            data: {
                content: 'Are you sure you want to delete this ?',
                confirmBtn: 'Yes',
                cancelBtn: 'Cancel'
            },
            disableClose: true
        });
        dialogRef.afterClosed().takeUntil(this.destroy$).subscribe(result => {
            if (result) {
                const index: number = params.node.rowIndex;
                this.gridApi.updateRowData({ remove: [retroFeedback] });
                if (this.feedbackType === RETRO_FEEDBACK_TYPES.HIGHLIGHT) {
                    this.retrospectiveService.deleteSprintHighlight(this.retrospectiveID, this.sprintID, retroFeedback.ID)
                        .takeUntil(this.destroy$)
                        .subscribe(() => { },
                            err => {
                                this.gridApi.updateRowData({ add: [retroFeedback], addIndex: index });
                                this.snackBar.open(
                                    this.utils.getApiErrorMessage(err) || API_RESPONSE_MESSAGES.sprintHighlightDeletedError,
                                    '', { duration: SNACKBAR_DURATION });
                            }
                        );
                } else if (this.feedbackType === RETRO_FEEDBACK_TYPES.NOTE) {
                    this.retrospectiveService.deleteRetroNote(this.retrospectiveID, this.sprintID, retroFeedback.ID)
                        .takeUntil(this.destroy$)
                        .subscribe(() => { },
                            err => {
                                this.gridApi.updateRowData({ add: [retroFeedback], addIndex: index });
                                this.snackBar.open(
                                    this.utils.getApiErrorMessage(err) || API_RESPONSE_MESSAGES.sprintNoteDeletedError,
                                    '', { duration: SNACKBAR_DURATION });
                            }
                        );
                } else if (this.feedbackType === RETRO_FEEDBACK_TYPES.GOAL) {
                    this.retrospectiveService.deleteRetroGoal(this.retrospectiveID, this.sprintID, retroFeedback.ID)
                        .takeUntil(this.destroy$)
                        .subscribe(() => { },
                            err => {
                                this.gridApi.updateRowData({ add: [retroFeedback], addIndex: index });
                                this.snackBar.open(
                                    this.utils.getApiErrorMessage(err) || API_RESPONSE_MESSAGES.sprintGoalDeletedError,
                                    '', { duration: SNACKBAR_DURATION });
                            }
                        );
                }

            }
        });

    }

    getTeamMemberOptions() {
        let teamMembers = this.teamMembers;
        teamMembers = _.map(teamMembers, (data: any) => {
            return {
                id: _.parseInt(data.ID),
                value: (data.FirstName + ' ' + data.LastName).trim(),
            };
        });
        return teamMembers;
    }

    revertCellValue(params, ...revertParams) {
        const rowData = params.data;
        rowData[params.colDef.field] = params.oldValue;
        // To revert the value of assigneeId when Scope changes
        if (params.colDef.field === 'Scope') {
            rowData.AssigneeID = revertParams[0];
        }
        this.gridApi.updateRowData({ update: [rowData] });
    }

    getDisplayedRowCount() {
        return (this.gridApi && this.gridApi.getDisplayedRowCount()) || 0;
    }

    resizeAgGrid() {
        if (this.gridApi && this.isTabActive) {
            setTimeout(() => {
                this.gridApi.sizeColumnsToFit();
            });
        }
    }

    private createColumnDefs(sprintStatus, teamMembers) {
        let editable = true;
        if (sprintStatus === SPRINT_STATES.FROZEN || this.feedbackSubType === this.goalTypes.COMPLETED) {
            editable = false;
        }
        let columnDefs;
        columnDefs = [
            {
                headerName: 'Text',
                field: 'Text',
                tooltipField: 'Text',
                minWidth: 500,
                editable: editable,
                cellEditor: 'agLargeTextCellEditor',
                cellEditorParams: {
                    maxLength: 1000
                },
                onCellValueChanged: (cellParams) => {
                    if (cellParams.newValue !== cellParams.oldValue) {
                        this.updateRetroFeedback(cellParams);
                    }
                },
                suppressKeyboardEvent: (event: SuppressKeyboardEventParams) => this.utils.isAgGridEditingEvent(event),
                filter: 'agTextColumnFilter',
                filterParams: {
                    newRowsAction: 'keep',
                    clearButton: true,
                },
            },
            {
                headerName: 'Scope',
                headerClass: 'custom-ag-grid-header',
                field: 'Scope',
                minWidth: 110,
                editable: editable,
                valueFormatter: (cellParams) => RETRO_FEEDBACK_SCOPE_LABELS[cellParams.value],
                cellEditor: 'selectEditor',
                cellEditorParams: {
                    selectOptions: _.map(RETRO_FEEDBACK_SCOPE_LABELS, (value, key) => {
                        return {
                            id: _.parseInt(key),
                            value: value
                        };
                    }),
                },
                onCellValueChanged: (cellParams) => {
                    if (cellParams.newValue !== cellParams.oldValue) {
                        this.updateRetroFeedback(cellParams);
                    }
                },
                filter: 'agSetColumnFilter',
                filterParams: {
                    suppressMiniFilter: true,
                    newRowsAction: 'keep',
                    clearButton: true,
                    values: Object.keys(RETRO_FEEDBACK_SCOPE_LABELS).sort()
                },
            },
            {
                headerName: 'Assignee',
                field: 'AssigneeID',
                minWidth: 160,
                editable: (cellParams) => {
                    return editable && cellParams.data.Scope === RETRO_FEEDBACK_SCOPE_TYPES.Individual;
                },
                cellRenderer: (cellParams) => this.assigneeKeyCreator(cellParams),
                keyCreator: (cellParams) => this.assigneeKeyCreator(cellParams),
                onCellValueChanged: (cellParams) => {
                    if (cellParams.newValue !== cellParams.oldValue) {
                        this.updateRetroFeedback(cellParams);
                    }
                },

                cellEditor: 'selectEditor',
                cellEditorParams: (cellParams) => {
                    if (cellParams.data.Scope === RETRO_FEEDBACK_SCOPE_TYPES.Individual) {
                        return {
                            selectOptions: this.getTeamMemberOptions(),
                        };
                    }
                },
                filter: 'agSetColumnFilter',
                filterParams: {
                    suppressMiniFilter: true,
                    newRowsAction: 'keep',
                    clearButton: true
                },
            },
            {
                headerName: 'Added At',
                field: 'AddedAt',
                minWidth: 160,
                valueFormatter: (cellParams) => this.utils.getDateFromString(cellParams.value || ''),
                filter: 'agDateColumnFilter',
                filterParams: {
                    suppressMiniFilter: true,
                    newRowsAction: 'keep',
                    clearButton: true,
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
            {
                headerName: 'Created By',
                field: 'CreatedBy',
                minWidth: 160,
                filter: 'agSetColumnFilter',
                cellRenderer: (cellParams) => this.createdByKeyCreater(cellParams),
                keyCreator: (cellParams) => this.createdByKeyCreater(cellParams),
                filterParams: {
                    suppressMiniFilter: true,
                    newRowsAction: 'keep',
                    clearButton: true,
                },
            },
        ];

        if (this.feedbackType === RETRO_FEEDBACK_TYPES.GOAL) {
            const goalSpecificColumn = [
                {
                    headerName: 'Expected At',
                    field: 'ExpectedAt',
                    minWidth: 160,
                    editable: editable,
                    cellEditor: 'datePicker',
                    cellEditorParams: {
                        minValue: this.sprintEndDate,
                    },
                    valueFormatter: (cellParams) => this.utils.getDateFromString(cellParams.value || ''),
                    onCellValueChanged: (cellParams) => {
                        if (!cellParams.newValue || cellParams.newValue !== cellParams.oldValue) {
                            this.updateRetroFeedback(cellParams);
                        }
                    },
                    filter: 'agDateColumnFilter',
                    filterParams: {
                        suppressMiniFilter: true,
                        newRowsAction: 'keep',
                        clearButton: true,
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

            const activeSprintAddedOrPendingGoalColumn = [
                {
                    headerName: 'Mark Resolved',
                    minWidth: 140,
                    cellRenderer: 'clickableButtonRenderer',
                    cellRendererParams: {
                        label: 'Mark Resolved',
                        onClick: this.resolveSprintGoal.bind(this)
                    },
                    suppressMenu: true,
                    suppressSorting: true,
                    suppressFilter: true,
                }
            ];

            const accomplishedGoalColumn = [
                {
                    headerName: 'Resolved At',
                    field: 'ResolvedAt',
                    minWidth: 150,
                    valueFormatter: (cellParams) => this.utils.getDateFromString(cellParams.value || ''),
                    filter: 'agDateColumnFilter',
                    filterParams: {
                        suppressMiniFilter: true,
                        newRowsAction: 'keep',
                        clearButton: true,
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

            const activeSprintAccomplishedGoalColumn = [
                {
                    headerName: 'Mark Unresolved',
                    minWidth: 160,
                    cellRenderer: 'clickableButtonRenderer',
                    cellRendererParams: {
                        label: 'Mark Unresolved',
                        onClick: this.unresolveSprintGoal.bind(this)
                    },
                    suppressMenu: true,
                    suppressSorting: true,
                    suppressFilter: true,
                },
            ];

            columnDefs = [...columnDefs, ...goalSpecificColumn];
            if (this.feedbackSubType === this.goalTypes.COMPLETED) {
                columnDefs = [...columnDefs, ...accomplishedGoalColumn];
            }
            if (sprintStatus !== SPRINT_STATES.FROZEN) {
                if (this.feedbackSubType === this.goalTypes.COMPLETED) {
                    columnDefs = [...columnDefs, ...activeSprintAccomplishedGoalColumn];
                } else {
                    columnDefs = [...columnDefs, ...activeSprintAddedOrPendingGoalColumn];
                }
            }
        }

        const deleteButtonColumnDef = {
            colId: 'delete',
            headerClass: 'custom-ag-grid-header',
            cellRenderer: 'deleteButtonRenderer',
            cellRendererParams: {
                useIcon: true,
                icon: 'delete',
                onClick: this.deleteRetroFeedback.bind(this)
            },
            minWidth: 100,
            cellClass: 'delete-column',
            suppressMenu: true,
            suppressSorting: true,
            suppressFilter: true,
        };

        if (sprintStatus === SPRINT_STATES.ACTIVE) {
            columnDefs.push(deleteButtonColumnDef);
        }

        return columnDefs;
    }

    // create keys with respect to cellparams of created by column in grid
    createdByKeyCreater(cellParams: any) {
        return (cellParams.value.FirstName + ' ' + cellParams.value.LastName).trim();
    }

    // create keys with respect to cellparams of assignee column in grid
    assigneeKeyCreator(cellParams: any) {
        const assignee: any = _.filter(this.teamMembers, (member) => member.ID === cellParams.value)[0];
        if (_.isEmpty(assignee)) {
            return '-';
        }
        return (assignee.FirstName + ' ' + assignee.LastName).trim();
    }

    clearFilters(event) {
        if (this.gridApi) {
            this.gridApi.setFilterModel(null);
            this.gridApi.onFilterChanged();
        }
        event.stopPropagation();
    }
    // TO save the states of column filters
    saveFilterState() {
        this.gridService.saveFilterState(this.feedbackSubType, this.gridApi.getFilterModel());
    }

    // To restore the saved state of column filters from grid service
    restoreFilterState() {
        this.gridApi.setFilterModel(this.gridService.getFilterState(this.feedbackSubType));
    }

    // To be called when there is any change in grid columns
    onDisplayedColumnsChanged(columnState: any) {
        if (this.skipColumnPreservationCounter <= 0) {
            if (this.isTabActive) {
                // To save the current state of columns in angular scope
                this.gridService.saveColumnState(this.retrospectiveID, this.feedbackSubType, columnState);
            }
        } else {
            // To ignore the saving of column states when first time grid is
            // initialized and first time data is inserted in grid
            // this runs two times to prevent overriding of column states saved in grid service
            this.skipColumnPreservationCounter--;
        }
    }

    // To restore the saved state of columns
    applyColumnState() {
        const savedColumnState = this.gridService.getColumnState(this.retrospectiveID, this.feedbackSubType);
        // To check if there is any saved column state for this table
        // if present then apply to grid
        if (savedColumnState && savedColumnState.length > 0) {
            this.columnApi.setColumnState(savedColumnState);
        }
    }
}
