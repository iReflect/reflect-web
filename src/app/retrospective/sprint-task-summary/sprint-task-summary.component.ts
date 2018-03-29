import { Component, HostListener, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { ColumnApi, GridApi, GridOptions } from 'ag-grid';
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/takeUntil';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import {
    API_RESPONSE_MESSAGES, MARK_DONE_LABELS, SNACKBAR_DURATION,
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
        if (this.gridApi) {
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
        if (changes.isTabActive) {
            this.isTabActive = changes.isTabActive.currentValue;
        }
        // this if block also executes when this.refreshOnChange toggles
        if (this.gridApi && this.isTabActive) {
            setTimeout(() => {
                this.gridApi.sizeColumnsToFit();
                this.getSprintTaskSummary(true);
            });
        }
        if (changes.enableRefresh) {
            this.enableRefresh = changes.enableRefresh.currentValue;
            this.autoRefreshCurrentState = changes.enableRefresh.currentValue;
            if (this.autoRefreshCurrentState && this.isTabActive && this.gridApi) {
                this.getSprintTaskSummary(true);
            }
            if (this.gridApi && changes.sprintStatus) {
                this.columnDefs = this.createColumnDefs(changes.sprintStatus.currentValue);
                this.gridApi.setColumnDefs(this.columnDefs);
            }
        }
    }

    ngOnDestroy() {
        this.autoRefreshCurrentState = false;
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
    }

    setGridOptions() {
        this.gridOptions = <GridOptions>{
            columnDefs: this.columnDefs,
            defaultColDef: {
                width: 100,
            },
            rowHeight: 48,
            frameworkComponents: {
                'clickableButtonRenderer': ClickableButtonRendererComponent
            },
            enableFilter: true,
            enableSorting: true,
            rowClassRules: {
                'invalid-ag-grid-row': (params) => {
                    return params.data.IsInvalid;
                }
            }
        };
    }

    onGridReady(params) {
        this.params = params;
        this.gridApi = params.api;
        this.columnApi = params.columnApi;
        this.getSprintTaskSummary(false);
        Observable.interval(5000)
            .takeUntil(this.destroy$)
            .subscribe(() => {
                if (this.isTabActive && this.autoRefreshCurrentState && this.gridApi) {
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
        const dialogRef = this.dialog.open(RetrospectTaskModalComponent, {
            width: '90%',
            data: {
                taskDetails: sprintTaskSummaryData,
                sprintID: this.sprintID,
                retrospectiveID: this.retrospectiveID,
                sprintStatus: this.sprintStatus,
                enableRefresh: this.enableRefresh
            },
        });
        dialogRef.afterClosed().subscribe(() => {
            this.getSprintTaskSummary(true);
            this.autoRefreshCurrentState = this.enableRefresh;
        });
    }

    private createColumnDefs(sprintStatus) {
        let markedDoneColumns = [];
        if (sprintStatus !== SPRINT_STATES.DRAFT && sprintStatus !== SPRINT_STATES.FROZEN) {
            markedDoneColumns = [
                {
                    headerName: 'Done At',
                    field: 'DoneAt',
                    minWidth: 170,
                    valueFormatter: (params) => this.utils.getDateFromString(params.value || ''),
                    suppressSorting: true,
                    suppressFilter: true,
                },
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
                headerName: 'Task ID',
                field: 'Key',
                minWidth: 110,
                pinned: true,
                suppressSorting: true,
                suppressFilter: true,
            },
            {
                headerName: 'Task Summary',
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
                headerName: 'Estimates',
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
                headerName: 'Story Type',
                field: 'Type',
                minWidth: 150,
                filter: 'agTextColumnFilter',
                filterParams: {
                    debounceMs: 500,
                    // To preserve the currently applied filters
                    newRowsAction: 'keep'
                }
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
