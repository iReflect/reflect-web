import {
    Component, EventEmitter, HostListener, Input, OnChanges, OnDestroy, OnInit, Output,
    SimpleChanges
} from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { ColumnApi, GridApi, GridOptions } from 'ag-grid';
import * as _ from 'lodash';

import {
    API_RESPONSE_MESSAGES,
    RETRO_FEEDBACK_GOAL_TYPES,
    RETRO_FEEDBACK_SCOPE_LABELS,
    RETRO_FEEDBACK_TYPES,
    SNACKBAR_DURATION,
    SPRINT_STATES
} from '@constants/app-constants';
import { SelectCellEditorComponent } from 'app/shared/ag-grid-editors/select-cell-editor/select-cell-editor.component';
import { DatePickerEditorComponent } from 'app/shared/ag-grid-editors/date-picker-editor/date-picker-editor.component';
import { ClickableButtonRendererComponent } from 'app/shared/ag-grid-renderers/clickable-button-renderer/clickable-button-renderer.component';
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
        private utils: UtilsService
    ) {
    }

    ngOnInit() {
        this.columnDefs = this.createColumnDefs(this.sprintStatus, this.teamMembers);
        this.setGridOptions();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (this.gridApi) {
            if (changes.sprintStatus || changes.teamMembers) {
                this.columnDefs = this.createColumnDefs(this.sprintStatus, this.teamMembers);
                this.gridApi.setColumnDefs(this.columnDefs);
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
            },
            onCellEditingStarted: () => this.onCellEditingStarted(),
            onCellEditingStopped: () => this.onCellEditingStopped(),
            onGridReady: event => this.onGridReady(event),
            rowHeight: 48,
            singleClickEdit: true,
            stopEditingWhenGridLosesFocus: true,
            suppressDragLeaveHidesColumns: true,
            suppressScrollOnNewData: true,
            onColumnVisible: (event) => this.gridApi.sizeColumnsToFit()
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
            }
            if (this.isTabActive) {
                this.gridApi.sizeColumnsToFit();
            }
        });
    }

    resolveSprintGoal(params: any) {
        const goalData = params.data;
        const index: number = params.node.rowIndex;
        this.gridApi.updateRowData({ remove: [goalData] });
        this.retrospectiveService.resolveSprintGoal(this.retrospectiveID, this.sprintID, goalData.ID)
            .takeUntil(this.destroy$)
            .subscribe(
                () => {
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
        const updatedRetroFeedbackData = {
            [params.colDef.field]: params.newValue
        };
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
                        this.revertCellValue(params);
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
                        this.revertCellValue(params);
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
                        this.revertCellValue(params);
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

    getTeamMemberOptions(teamMembers) {
        teamMembers = _.map(teamMembers, (data: any) => {
            return {
                id: _.parseInt(data.ID),
                value: (data.FirstName + ' ' + data.LastName).trim(),
            };
        });
        return [{ id: null, value: 'None' }, ...teamMembers];
    }

    revertCellValue(params) {
        const rowData = params.data;
        rowData[params.colDef.field] = params.oldValue;
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
                editable: editable,
                valueFormatter: (cellParams) => {
                    const assignee: any = _.filter(this.teamMembers, (member) => member.ID === cellParams.value)[0];
                    if (_.isEmpty(assignee)) {
                        return '-';
                    }
                    return (assignee.FirstName + ' ' + assignee.LastName).trim();
                },
                onCellValueChanged: (cellParams) => {
                    if (cellParams.newValue !== cellParams.oldValue) {
                        this.updateRetroFeedback(cellParams);
                    }
                },
                cellEditor: 'selectEditor',
                cellEditorParams: {
                    selectOptions: this.getTeamMemberOptions(teamMembers),
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
        return columnDefs;
    }
    // create keys with respect to cellparams of created by column in grid
    createdByKeyCreater(cellParams: any) {
        return (cellParams.value.FirstName + ' ' + cellParams.value.LastName).trim();
    }

    clearFilters(event) {
        if (this.gridApi) {
            this.gridApi.setFilterModel(null);
            this.gridApi.onFilterChanged();
        }
        event.stopPropagation();
    }
}
