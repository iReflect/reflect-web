import { Component, HostListener, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { ColumnApi, GridApi, GridOptions } from 'ag-grid';
import { RetrospectiveService } from '../../shared/services/retrospective.service';
import { MatDialog, MatSnackBar } from '@angular/material';
import { API_RESPONSE_MESSAGES, SNACKBAR_DURATION } from '../../../constants/app-constants';
import { RetrospectTaskModalComponent } from '../retrospect-task-modal/retrospect-task-modal.component';
import {
    ClickableButtonRendererComponent
} from '../../shared/ag-grid-renderers/clickable-button-renderer/clickable-button-renderer.component';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/observable/interval';

@Component({
    selector: 'app-sprint-task-summary',
    templateUrl: './sprint-task-summary.component.html',
    styleUrls: ['./sprint-task-summary.component.scss']
})
export class SprintTaskSummaryComponent implements OnChanges, OnDestroy {
    gridOptions: GridOptions;
    enableRefresh = true;
    autoRefreshPreviousState = true;
    destroy$: Subject<boolean> = new Subject<boolean>();
    overlayLoadingTemplate = '<span class="ag-overlay-loading-center">Please wait while the tasks are loading!</span>';
    overlayNoRowsTemplate = '<span>No Tasks in this sprint!</span>';

    private params: any;
    private columnDefs: any;
    private gridApi: GridApi;
    private columnApi: ColumnApi;

    @Input() retrospectiveID;
    @Input() sprintID;
    @Input() sprintStatus;
    @Input() isTabActive: boolean;

    @HostListener('window:resize') onResize() {
        if (this.gridApi) {
            setTimeout(() => {
                this.gridApi.sizeColumnsToFit();
            });
        }
    }

    constructor(private snackBar: MatSnackBar,
                public dialog: MatDialog,
                private retrospectiveService: RetrospectiveService) {
        this.enableRefresh = true;
        this.columnDefs = this.createColumnDefs();
        this.setGridOptions();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (this.gridApi && changes.isTabActive && changes.isTabActive.currentValue) {
            setTimeout(() => {
                this.gridApi.sizeColumnsToFit();
                this.getSprintTaskSummary(true);
            });
        }
    }

    ngOnDestroy() {
        this.enableRefresh = false;
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
    }

    toggleAutoRefresh() {
        this.enableRefresh = !this.enableRefresh;
        this.autoRefreshPreviousState = this.enableRefresh;
        if (this.enableRefresh) {
            this.getSprintTaskSummary(true);
        }
    }

    setGridOptions() {
        this.gridOptions = <GridOptions>{
            columnDefs: this.columnDefs,
            defaultColDef: {
                width: 100,
            },
            rowHeight: 48,
            frameworkComponents: {
                'retrospectButtonRenderer': ClickableButtonRendererComponent
            },
            enableFilter: true,
            enableSorting: true,
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
                if (this.isTabActive && this.enableRefresh) {
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
                () => {
                    if (isRefresh) {
                        this.snackBar.open(API_RESPONSE_MESSAGES.autoRefreshFailure, '', {duration: SNACKBAR_DURATION});
                    } else {
                        this.snackBar.open(API_RESPONSE_MESSAGES.getSprintTaskSummaryError, '', {duration: SNACKBAR_DURATION});
                    }
                }
            );
    }

    private createColumnDefs() {
        const columnDefs = [
            {
                headerName: 'Task ID',
                field: 'TaskID',
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
                valueFormatter: (cellParams) => (cellParams.value / 60).toFixed(2),
                minWidth: 140,
                suppressSorting: true,
                suppressFilter: true,
            },
            {
                headerName: 'Total Time Spent',
                field: 'TotalTime',
                valueFormatter: (cellParams) => (cellParams.value / 60).toFixed(2),
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
            {
                headerName: 'Retrospect',
                cellRenderer: 'retrospectButtonRenderer',
                cellRendererParams: {
                    label: 'Retrospect',
                    onClick: this.retrospectSprint.bind(this)
                },
                minWidth: 130,
                suppressSorting: true,
                suppressFilter: true,
            }
        ];
        return columnDefs;
    }

    retrospectSprint(sprintTaskSummaryData) {
        this.autoRefreshPreviousState = this.enableRefresh;
        this.enableRefresh = false;
        const dialogRef = this.dialog.open(RetrospectTaskModalComponent, {
            width: '90%',
            data: {
                taskDetails: sprintTaskSummaryData,
                sprintID: this.sprintID,
                retrospectiveID: this.retrospectiveID,
                sprintStatus: this.sprintStatus
            },
        });
        dialogRef.afterClosed().subscribe(() => {
            this.getSprintTaskSummary(true);
            this.enableRefresh = this.autoRefreshPreviousState;
        });
    }
}
