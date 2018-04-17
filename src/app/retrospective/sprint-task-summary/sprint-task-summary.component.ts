import { Component, HostListener, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { MatDialogRef } from '@angular/material/dialog/typings/dialog-ref';
import { ColumnApi, GridApi, GridOptions } from 'ag-grid';
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/takeUntil';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import {
    API_RESPONSE_MESSAGES,
    AUTO_REFRESH_DURATION,
    MARK_DONE_LABELS,
    SNACKBAR_DURATION,
    SPRINT_STATES
} from '../../../constants/app-constants';
import { ClickableButtonRendererComponent } from '../../shared/ag-grid-renderers/clickable-button-renderer/clickable-button-renderer.component';
import { RetrospectiveService } from '../../shared/services/retrospective.service';
import { RetrospectTaskModalComponent } from '../retrospect-task-modal/retrospect-task-modal.component';
import { UtilsService } from '../../shared/utils/utils.service';

@Component({
    selector: 'app-sprint-task-summary',
    templateUrl: './sprint-task-summary.component.html',
    styleUrls: ['./sprint-task-summary.component.scss']
})
export class SprintTaskSummaryComponent implements OnInit, OnChanges, OnDestroy {
    gridOptions: GridOptions;
    dialogRef: MatDialogRef<any>;
    autoRefreshCurrentState: boolean;
    destroy$: Subject<boolean> = new Subject<boolean>();
    overlayLoadingTemplate = '<span class="ag-overlay-loading-center">Please wait while the tasks are loading!</span>';
    overlayNoRowsTemplate = '<span>No Tasks in this sprint!</span>';

    @Input() retrospectiveID;
    @Input() sprintID;
    @Input() sprintStatus;
    @Input() isTabActive: boolean;
    @Input() enableRefresh: boolean;
    @Input() refreshOnChange: boolean;
    @Input() isSprintEditable: boolean;

    private params: any;
    private columnDefs: any;
    private gridApi: GridApi;
    private columnApi: ColumnApi;

    constructor(
        private snackBar: MatSnackBar,
        public dialog: MatDialog,
        private retrospectiveService: RetrospectiveService,
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
        this.columnDefs = this.createColumnDefs(this.sprintStatus);
        this.setGridOptions();
        this.autoRefreshCurrentState = this.enableRefresh;
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.enableRefresh) {
            this.autoRefreshCurrentState = changes.enableRefresh.currentValue;
        }
        if (changes.sprintStatus) {
            this.columnDefs = this.createColumnDefs(changes.sprintStatus.currentValue);
            if (this.gridApi) {
                this.gridApi.setColumnDefs(this.columnDefs);
            }
        }
        if (this.gridApi) {
            // this if block also executes when changes.refreshOnChange toggles
            if (this.isTabActive && !changes.isTabActive) {
                this.gridApi.sizeColumnsToFit();
            }
            if (this.isTabActive && (this.autoRefreshCurrentState || changes.refreshOnChange)) {
                this.getSprintTaskSummary(true);
            }
            // we do this separately because we need to wait
            // at the least one tick when this tab is made active
            if (changes.isTabActive && changes.isTabActive.currentValue) {
                setTimeout(() => {
                    this.getSprintTaskSummary(true);
                    this.gridApi.sizeColumnsToFit();
                });
            }
        }
    }

    ngOnDestroy() {
        this.autoRefreshCurrentState = false;
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
        if (this.dialogRef) {
            this.dialogRef.close();
        }
    }

    setGridOptions() {
        this.gridOptions = <GridOptions>{
            columnDefs: this.columnDefs,
            defaultColDef: {
                width: 100,
            },
            enableFilter: true,
            enableSorting: true,
            frameworkComponents: {
                'clickableButtonRenderer': ClickableButtonRendererComponent
            },
            rowClassRules: {
                'invalid-ag-grid-row': (params) => {
                    return params.data.IsInvalid;
                }
            },
            onGridReady: event => this.onGridReady(event),
            overlayLoadingTemplate: this.overlayLoadingTemplate,
            overlayNoRowsTemplate: this.overlayNoRowsTemplate,
            rowHeight: 48,
            suppressScrollOnNewData: true,
            stopEditingWhenGridLosesFocus: true
        };
    }

    onGridReady(params) {
        this.params = params;
        this.gridApi = params.api;
        this.columnApi = params.columnApi;
        this.getSprintTaskSummary(false);
        if (this.isTabActive) {
            this.gridApi.sizeColumnsToFit();
        }
        Observable.interval(AUTO_REFRESH_DURATION)
            .takeUntil(this.destroy$)
            .subscribe(() => {
                if (this.isTabActive && this.autoRefreshCurrentState) {
                    this.getSprintTaskSummary(true);
                }
            });
    }

    getSprintTaskSummary(isRefresh) {
        this.retrospectiveService.getSprintTaskSummary(this.retrospectiveID, this.sprintID)
            .subscribe(
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
                            API_RESPONSE_MESSAGES.taskSummaryRefreshFailure,
                            '', {duration: SNACKBAR_DURATION});
                    } else {
                        this.snackBar.open(
                            this.utils.getApiErrorMessage(err) || API_RESPONSE_MESSAGES
                                .getSprintTaskSummaryError,
                            '', {duration: SNACKBAR_DURATION});
                    }
                }
            );
    }

    retrospectSprint(params) {
        const sprintTaskSummaryData = params.data;
        this.autoRefreshCurrentState = false;
        this.dialogRef = this.dialog.open(RetrospectTaskModalComponent, {
            width: '90%',
            data: {
                taskDetails: sprintTaskSummaryData,
                sprintID: this.sprintID,
                retrospectiveID: this.retrospectiveID,
                sprintStatus: this.sprintStatus,
                enableRefresh: this.enableRefresh,
                isSprintEditable: this.isSprintEditable,
            },
        });
        this.dialogRef.afterClosed().subscribe(() => {
            this.getSprintTaskSummary(true);
            this.autoRefreshCurrentState = this.enableRefresh;
        });
    }

    private createColumnDefs(sprintStatus) {
        let markedDoneColumns = [];
        if ([SPRINT_STATES.DRAFT, SPRINT_STATES.FROZEN].indexOf(sprintStatus) === -1) {
            markedDoneColumns = [
                {
                    colId: 'markDone',
                    cellRenderer: 'clickableButtonRenderer',
                    cellRendererParams: (params) => {
                        return {
                            label: params.data.DoneAt ? MARK_DONE_LABELS.UNDONE : MARK_DONE_LABELS.DONE,
                            onClick: this.markDoneUnDone.bind(this),
                        };
                    },
                    minWidth: 130,
                    suppressSorting: true,
                    suppressFilter: true,
                }
            ];
        }
        return [
            {
                headerName: 'ID',
                field: 'Key',
                minWidth: 110,
                pinned: true,
                suppressSorting: true,
                suppressFilter: true,
            },
            {
                headerName: 'Summary',
                field: 'Summary',
                minWidth: 300,
                tooltipField: 'Summary',
                pinned: true,
                suppressSorting: true,
                suppressFilter: true,
            },
            {
                headerName: 'Assignee',
                field: 'Assignee',
                minWidth: 160,
                suppressSorting: true,
                suppressFilter: true,
            },
            {
                headerName: 'Estimated Points',
                field: 'Estimate',
                minWidth: 120,
                suppressSorting: true,
                suppressFilter: true,
                valueFormatter: (cellParams) => this.utils.formatFloat(cellParams.value)
            },
            {
                headerName: 'Status',
                field: 'Status',
                minWidth: 140,
                suppressSorting: true,
                suppressFilter: true,
            },
            {
                headerName: 'Sprint Hours',
                field: 'SprintTime',
                valueFormatter: (cellParams) => this.utils.formatFloat(cellParams.value / 60),
                minWidth: 140,
                suppressSorting: true,
                suppressFilter: true,
            },
            {
                headerName: 'Total Time Spent',
                field: 'TotalTime',
                valueFormatter: (cellParams) => this.utils.formatFloat(cellParams.value / 60),
                minWidth: 160,
                suppressSorting: true,
                suppressFilter: true,
            },
            {
                headerName: 'Type',
                field: 'Type',
                minWidth: 150,
                filter: 'agTextColumnFilter',
                filterParams: {
                    debounceMs: 500,
                    // To preserve the currently applied filters
                    newRowsAction: 'keep'
                }
            },
            {
                headerName: 'Done At',
                field: 'DoneAt',
                minWidth: 170,
                valueFormatter: (params) => this.utils.getDateFromString(params.value || ''),
                suppressSorting: true,
                suppressFilter: true,
            },
            ...markedDoneColumns,
            {
                headerName: 'Retrospect',
                cellRenderer: 'clickableButtonRenderer',
                cellRendererParams: {
                    label: 'Retrospect',
                    onClick: this.retrospectSprint.bind(this)
                },
                minWidth: 130,
                suppressSorting: true,
                suppressFilter: true,
            }
        ];
    }

    getDisplayedRowCount() {
        return (this.gridApi && this.gridApi.getDisplayedRowCount()) || 0;
    }

    markDoneUnDone(params) {
        const sprintTaskSummaryData = params.data;
        if (sprintTaskSummaryData.DoneAt) {
            this.retrospectiveService.markSprintTaskUnDone(this.retrospectiveID, this.sprintID, sprintTaskSummaryData.ID).subscribe(
                response => {
                    const sprintTaskSummary = response.data;
                    params.node.setData(sprintTaskSummary);
                    // Refresh the Mark Done/Undone cell to reflect the change in button label
                    params.refreshCell({ suppressFlash: false, newData: false, forceRefresh: true });
                    this.snackBar.open(API_RESPONSE_MESSAGES.getSprintTaskMarkUnDoneSuccess, '', {duration: SNACKBAR_DURATION});
                },
                err => {
                    this.snackBar.open(this.utils.getApiErrorMessage(err) || API_RESPONSE_MESSAGES.error,
                        '', {duration: SNACKBAR_DURATION});
                }
            );
        } else {
            this.retrospectiveService.markSprintTaskDone(this.retrospectiveID, this.sprintID, sprintTaskSummaryData.ID).subscribe(
                response => {
                    const sprintTaskSummary = response.data;
                    params.node.setData(sprintTaskSummary);
                    // Refresh the Mark Done/Undone cell to reflect the change in button label
                    params.refreshCell({ suppressFlash: false, newData: false, forceRefresh: true });
                    this.snackBar.open(API_RESPONSE_MESSAGES.getSprintTaskMarkDoneSuccess, '', {duration: SNACKBAR_DURATION});
                },
                err => {
                    this.snackBar.open(this.utils.getApiErrorMessage(err) || API_RESPONSE_MESSAGES.error,
                        '', {duration: SNACKBAR_DURATION});
                }
            );
        }
    }
}
