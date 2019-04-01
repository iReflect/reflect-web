import { Component, EventEmitter, HostListener, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { ColumnApi, GridApi, GridOptions } from 'ag-grid';
import { MatDialog, MatSnackBar } from '@angular/material';
import * as _ from 'lodash';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/finally';
import {
    API_RESPONSE_MESSAGES,
    AUTO_REFRESH_DURATION,
    RETRO_SUMMARY_TYPES,
    RATING_STATES,
    RATING_STATES_LABEL,
    SNACKBAR_DURATION,
} from '@constants/app-constants';
import { NumericCellEditorComponent } from 'app/shared/ag-grid-editors/numeric-cell-editor/numeric-cell-editor.component';
import { SelectCellEditorComponent } from 'app/shared/ag-grid-editors/select-cell-editor/select-cell-editor.component';
import { ClickableButtonRendererComponent } from 'app/shared/ag-grid-renderers/clickable-button-renderer/clickable-button-renderer.component';
import { RatingRendererComponent } from 'app/shared/ag-grid-renderers/rating-renderer/rating-renderer.component';
import { BasicModalComponent } from 'app/shared/basic-modal/basic-modal.component';
import { RetrospectiveService } from 'app/shared/services/retrospective.service';
import { FilterDataService } from 'app/shared/services/filter-data.service';
import { UtilsService } from 'app/shared/utils/utils.service';
import { AppConfig } from 'app/app.config';
@Component({
    selector: 'app-sprint-member-summary',
    templateUrl: './sprint-member-summary.component.html',
    styleUrls: ['./sprint-member-summary.component.scss']
})
export class SprintMemberSummaryComponent implements OnInit, OnChanges, OnDestroy {
    retroMembers = [];
    memberIDs = [];
    selectedMemberID: any;
    autoRefreshCurrentState: boolean;
    gridOptions: GridOptions;
    ratingStates = RATING_STATES;
    overlayLoadingTemplate = '<span class="ag-overlay-loading-center">Please wait while the members are loading!</span>';
    overlayNoRowsTemplate = '<span>No Members for this sprint!</span>';
    // To ignore column data updation in angular scope when grid is intialized
    setColumnflag: boolean;
    @Input() retrospectiveID;
    @Input() sprintID;
    @Input() isSprintEditable: boolean;
    @Input() sprintDays: any;
    @Input() isTabActive: boolean;
    @Input() enableRefresh: boolean;
    @Input() refreshOnChange: boolean;

    @Output() onRefreshStart = new EventEmitter<boolean>();
    @Output() onRefreshEnd = new EventEmitter<boolean>();

    private columnDefs: any;
    private params: any;
    private gridApi: GridApi;
    private columnApi: ColumnApi;
    private destroy$: Subject<boolean> = new Subject<boolean>();

    constructor(
        private retrospectiveService: RetrospectiveService,
        private snackBar: MatSnackBar,
        private utils: UtilsService,
        private filters: FilterDataService,
        public dialog: MatDialog
    ) {
    }

    @HostListener('window:resize') onResize() {
        if (this.gridApi && this.isTabActive) {
            setTimeout(() => {
                this.gridApi.sizeColumnsToFit();
            });
        }
    }

    ngOnInit() {
        this.autoRefreshCurrentState = this.enableRefresh;
        this.getRetroMembers();
        this.columnDefs = this.createColumnDefs(this.isSprintEditable);
        this.setColumnflag = false;
        this.setGridOptions();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.enableRefresh) {
            this.autoRefreshCurrentState = changes.enableRefresh.currentValue;
        }
        if (this.gridApi) {
            if (changes.isSprintEditable) {
                this.columnDefs = this.createColumnDefs(changes.isSprintEditable.currentValue);
                this.gridApi.setColumnDefs(this.columnDefs);
            }
            // this if block also executes when changes.refreshOnChange toggles
            if (this.isTabActive && !changes.isTabActive) {
                if (this.autoRefreshCurrentState) {
                    this.refreshSprintMemberSummary(true);
                }
                if (changes.refreshOnChange) {
                    this.refreshSprintMemberSummary();
                }
                this.gridApi.sizeColumnsToFit();
                this.setColumnState();
            }
            // we do this separately because we need to wait
            // at the least one tick when this tab is made active
            if (changes.isTabActive && changes.isTabActive.currentValue) {
                setTimeout(() => {
                    this.refreshSprintMemberSummary();
                    this.gridApi.sizeColumnsToFit();
                    this.setColumnState();
                });
            }
            if (changes.isTabActive && !changes.isTabActive.currentValue) {
                this.filters.setFilterData(RETRO_SUMMARY_TYPES.MEMBER, this.gridApi.getFilterModel());
            }
        }
    }

    ngOnDestroy() {
        this.autoRefreshCurrentState = false;
        this.destroy$.next(true);
        this.destroy$.complete();
    }

    getRetroMembers() {
        this.retrospectiveService.getRetroMembers(this.retrospectiveID)
            .takeUntil(this.destroy$)
            .subscribe(
                response => {
                    this.retroMembers = response.data.Members;
                },
                err => {
                    this.snackBar.open(
                        this.utils.getApiErrorMessage(err) || API_RESPONSE_MESSAGES.getRetrospectiveMembersError,
                        '', { duration: SNACKBAR_DURATION });
                }
            );
    }

    setGridOptions() {
        this.gridOptions = <GridOptions>{
            columnDefs: this.columnDefs,
            frameworkComponents: {
                'ratingEditor': SelectCellEditorComponent,
                'ratingRenderer': RatingRendererComponent,
                'deleteButtonRenderer': ClickableButtonRendererComponent,
                'numericEditor': NumericCellEditorComponent
            },
            onCellEditingStarted: () => this.onCellEditingStarted(),
            onCellEditingStopped: () => this.onCellEditingStopped(),
            onGridReady: event => this.onGridReady(event),
            overlayLoadingTemplate: this.overlayLoadingTemplate,
            overlayNoRowsTemplate: this.overlayNoRowsTemplate,
            rowHeight: 48,
            singleClickEdit: true,
            suppressDragLeaveHidesColumns: true,
            suppressScrollOnNewData: true,
            stopEditingWhenGridLosesFocus: true,
            onColumnVisible: (event) => this.gridApi.sizeColumnsToFit(),
            // this event is triggred when there is change in grid columns
            onDisplayedColumnsChanged: (event) => {
                this.setColumnData(event.columnApi.getColumnState());
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
            this.getSprintMemberSummary().subscribe();
            this.gridApi.sizeColumnsToFit();
        }
        Observable.interval(AUTO_REFRESH_DURATION)
            .takeUntil(this.destroy$)
            .subscribe(() => {
                if (this.autoRefreshCurrentState && this.isTabActive) {
                    this.refreshSprintMemberSummary(true);
                    this.setColumnState();
                }
            });
        this.setColumnState();
    }

    onCellEditingStarted() {
        this.autoRefreshCurrentState = false;
    }

    onCellEditingStopped() {
        this.autoRefreshCurrentState = this.enableRefresh;
    }

    refreshSprintMemberSummary(isAutoRefresh = false) {
        if (!isAutoRefresh) {
            this.onRefreshStart.emit(true);
        }
        this.getSprintMemberSummary(true, isAutoRefresh)
            .finally(() => {
                if (!isAutoRefresh) {
                    this.onRefreshEnd.emit(true);
                }
            })
            .subscribe();
    }

    getSprintMemberSummary(isRefresh = false, isAutoRefresh = false) {
        this.filters.setFilterData(RETRO_SUMMARY_TYPES.MEMBER, this.gridApi.getFilterModel());
        return this.retrospectiveService.getSprintMemberSummary(this.retrospectiveID, this.sprintID, isAutoRefresh)
            .takeUntil(this.destroy$)
            .do(
                response => {
                    const members = response.data.Members;
                    this.gridApi.setRowData(members);
                    this.memberIDs = [];
                    members.forEach(member => {
                        this.memberIDs.push(member.ID);
                    });
                    if (!isRefresh && this.isTabActive) {
                        this.gridApi.sizeColumnsToFit();
                    }
                    this.restoreFilterData();
                },
                err => {
                    this.restoreFilterData();
                    if (isRefresh) {
                        this.snackBar.open(
                            API_RESPONSE_MESSAGES.memberSummaryRefreshFailure,
                            '', { duration: SNACKBAR_DURATION });
                    } else {
                        this.snackBar.open(
                            this.utils.getApiErrorMessage(err) || API_RESPONSE_MESSAGES
                                .getSprintMemberSummaryError,
                            '', { duration: SNACKBAR_DURATION });
                    }
                },
            );

    }

    addSprintMember() {
        if (this.selectedMemberID === undefined) {
            this.snackBar.open(
                API_RESPONSE_MESSAGES.memberNotSelectedError,
                '', { duration: SNACKBAR_DURATION });
        } else if (this.memberIDs.indexOf(this.selectedMemberID) !== -1) {
            this.snackBar.open(
                API_RESPONSE_MESSAGES.memberAlreadyPresent,
                '', { duration: SNACKBAR_DURATION });
        } else {
            this.retrospectiveService.addSprintMember(this.retrospectiveID, this.sprintID, this.selectedMemberID)
                .takeUntil(this.destroy$)
                .subscribe(
                    response => {
                        this.gridApi.updateRowData({ add: [response.data] });
                        this.memberIDs.push(this.selectedMemberID);
                    },
                    err => {
                        this.snackBar.open(
                            this.utils.getApiErrorMessage(err) || API_RESPONSE_MESSAGES.addSprintMemberError,
                            '', { duration: SNACKBAR_DURATION });
                    }
                );
        }
    }

    updateSprintMember(params) {
        const updatedSprintMemberData = {
            [params.colDef.field]: params.newValue
        };
        this.retrospectiveService.updateSprintMember(this.retrospectiveID, this.sprintID, params.data.ID, updatedSprintMemberData)
            .takeUntil(this.destroy$)
            .subscribe(
                response => {
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
    }

    deleteSprintMember(params) {
        const member = params.data;
        const dialogRef = this.dialog.open(BasicModalComponent, {
            data: {
                content: 'Are you sure you want to remove ' + (member.FirstName + ' ' + member.LastName).trim() + '?',
                confirmBtn: 'Yes',
                cancelBtn: 'Cancel'
            },
            disableClose: true
        });

        dialogRef.afterClosed().takeUntil(this.destroy$).subscribe(result => {
            if (result) {
                const index: number = params.node.rowIndex;
                this.gridApi.updateRowData({ remove: [member] });
                this.retrospectiveService.deleteSprintMember(this.retrospectiveID, this.sprintID, member.ID)
                    .takeUntil(this.destroy$)
                    .subscribe(
                        () => {
                            this.memberIDs = this.memberIDs.filter(ID => ID !== member.ID);
                        },
                        err => {
                            this.gridApi.updateRowData({ add: [member], addIndex: index });
                            this.snackBar.open(
                                this.utils.getApiErrorMessage(err) || API_RESPONSE_MESSAGES
                                    .deleteSprintMemberError,
                                '', { duration: SNACKBAR_DURATION });
                        }
                    );
            }
        });
    }

    private createColumnDefs(isSprintEditable) {
        let deleteButtonColumnDef: any = {};
        if (isSprintEditable) {
            deleteButtonColumnDef = {
                cellRenderer: 'deleteButtonRenderer',
                cellRendererParams: {
                    useIcon: true,
                    icon: 'delete',
                    onClick: this.deleteSprintMember.bind(this)
                },
                minWidth: 100,
                cellClass: 'delete-column',
                suppressMenu: true,
                suppressSorting: true,
                suppressFilter: true,
            };
        }
        const columnDefs = [
            {
                headerName: 'Name',
                colId: 'Name',
                valueGetter: (cellParams) => {
                    return (cellParams.data.FirstName + ' ' + cellParams.data.LastName).trim();
                },
                minWidth: 160,
                filter: 'agSetColumnFilter',
                filterParams: {
                    newRowsAction: 'keep',
                    clearButton: true,
                },
                pinned: true
            },
            {
                headerName: 'Allocation',
                headerClass: 'custom-ag-grid-header',
                field: 'AllocationPercent',
                editable: isSprintEditable,
                minWidth: 130,
                suppressFilter: true,
                valueParser: 'Number(newValue)',
                cellEditor: 'numericEditor',
                cellEditorParams: {
                    minValue: 0
                },
                valueFormatter: (cellParams) => this.utils.formatFloat(cellParams.value) + '%',
                onCellValueChanged: (cellParams) => {
                    if (cellParams.newValue !== cellParams.oldValue) {
                        if (cellParams.newValue >= 0) {
                            this.updateSprintMember(cellParams);
                        } else {
                            this.snackBar.open(
                                API_RESPONSE_MESSAGES.allocationNegativeError,
                                '', { duration: SNACKBAR_DURATION });
                            this.revertCellValue(cellParams);
                        }
                    }
                },
                suppressKeyboardEvent: (event) => this.utils.isAgGridEditingEvent(event)
            },
            {
                headerName: 'Expectation',
                headerClass: 'custom-ag-grid-header',
                field: 'ExpectationPercent',
                editable: isSprintEditable,
                minWidth: 140,
                suppressFilter: true,
                valueParser: 'Number(newValue)',
                cellEditor: 'numericEditor',
                cellEditorParams: {
                    minValue: 0
                },
                valueFormatter: (cellParams) => this.utils.formatFloat(cellParams.value) + '%',
                onCellValueChanged: (cellParams) => {
                    if (cellParams.newValue !== cellParams.oldValue) {
                        if (cellParams.newValue >= 0) {
                            this.updateSprintMember(cellParams);
                        } else {
                            this.snackBar.open(
                                API_RESPONSE_MESSAGES.expectationNegativeError,
                                '', { duration: SNACKBAR_DURATION });
                            this.revertCellValue(cellParams);
                        }
                    }
                },
                suppressKeyboardEvent: (event) => this.utils.isAgGridEditingEvent(event)
            },
            {
                headerName: 'Vacations',
                headerClass: 'custom-ag-grid-header',
                field: 'Vacations',
                editable: isSprintEditable,
                minWidth: 130,
                suppressFilter: true,
                valueParser: 'Number(newValue)',
                cellEditor: 'numericEditor',
                cellEditorParams: {
                    minValue: 0,
                    maxValue: this.sprintDays
                },
                valueFormatter: (cellParams) => this.utils.formatFloat(cellParams.value) + (cellParams.value === 1 ? ' day' : ' days'),
                onCellValueChanged: (cellParams) => {
                    if (cellParams.newValue !== cellParams.oldValue) {
                        if (cellParams.newValue < 0) {
                            this.snackBar.open(
                                API_RESPONSE_MESSAGES.vacationNumberError,
                                '', { duration: SNACKBAR_DURATION });
                            this.revertCellValue(cellParams);
                        } else if (cellParams.newValue > this.sprintDays) {
                            this.snackBar.open(
                                API_RESPONSE_MESSAGES.vacationTimeError,
                                '', { duration: SNACKBAR_DURATION });
                            this.revertCellValue(cellParams);
                        } else {
                            this.updateSprintMember(cellParams);
                        }
                    }
                },
                suppressKeyboardEvent: (event) => this.utils.isAgGridEditingEvent(event)
            },
            {
                headerName: 'Expected Points',
                headerClass: 'custom-ag-grid-header',
                field: 'ExpectedStoryPoint',
                minWidth: 130,
                suppressFilter: true,
                valueFormatter: (cellParams) => this.utils.formatFloat(cellParams.value)
            },
            {
                headerName: 'Actual Points',
                headerClass: 'custom-ag-grid-header',
                field: 'ActualStoryPoint',
                minWidth: 120,
                suppressFilter: true,
                valueFormatter: (cellParams) => this.utils.formatFloat(cellParams.value)
            },
            {
                headerName: 'Sprint Hours',
                headerClass: 'custom-ag-grid-header',
                field: 'TotalTimeSpentInMin',
                minWidth: 120,
                suppressFilter: true,
                valueFormatter: (cellParams) => this.utils.formatFloat(cellParams.value / 60),
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
                        this.updateSprintMember(cellParams);
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
                tooltipField: 'Comment',
                minWidth: 300,
                editable: isSprintEditable,
                cellEditor: 'agLargeTextCellEditor',
                cellEditorParams: {
                    maxLength: 1000
                },
                filter: 'agTextColumnFilter',
                filterParams: {
                    newRowsAction: 'keep',
                    clearButton: true,
                },
                onCellValueChanged: (cellParams) => {
                    if (cellParams.newValue !== cellParams.oldValue) {
                        this.updateSprintMember(cellParams);
                    }
                },
                suppressKeyboardEvent: (event) => this.utils.isAgGridEditingEvent(event)
            }
        ];
        if (!_.isEmpty(deleteButtonColumnDef)) {
            columnDefs.push(deleteButtonColumnDef);
        }
        return columnDefs;
    }

    getDisplayedRowCount() {
        return (this.gridApi && this.gridApi.getDisplayedRowCount()) || 0;
    }

    clearFilters() {
        if (this.gridApi) {
            this.gridApi.setFilterModel(null);
            this.gridApi.onFilterChanged();
            this.filters.setFilterData(RETRO_SUMMARY_TYPES.MEMBER, this.gridApi.getFilterModel());
        }
    }
    // restore the state of filter
    restoreFilterData() {
        this.gridApi.setFilterModel(this.filters.getFilterData(RETRO_SUMMARY_TYPES.MEMBER));
        this.gridApi.onFilterChanged();
    }
    // To save the current state of columns in angular scope
    setColumnData(columnData) {
        if (this.setColumnflag && this.isTabActive) {
            this.filters.setColumnData(this.retrospectiveID, RETRO_SUMMARY_TYPES.MEMBER, columnData);
        }
        if (!this.setColumnflag) {
            this.setColumnflag = true;
        }
    }
    // To restore the saved state of columns
    setColumnState() {
        const columnData = this.filters.getColumnData(this.retrospectiveID, RETRO_SUMMARY_TYPES.MEMBER);
        if (columnData && columnData.length > 0) {
            this.columnApi.setColumnState(columnData);
        }
    }
}
