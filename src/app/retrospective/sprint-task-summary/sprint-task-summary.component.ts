import {
    Component,
    HostListener,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    SimpleChanges
} from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { ColumnApi, GridApi, GridOptions } from 'ag-grid';
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/takeUntil';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { API_RESPONSE_MESSAGES, SNACKBAR_DURATION } from '../../../constants/app-constants';
import { ClickableButtonRendererComponent } from '../../shared/ag-grid-renderers/clickable-button-renderer/clickable-button-renderer.component';
import { RetrospectiveService } from '../../shared/services/retrospective.service';
import { RetrospectTaskModalComponent } from '../retrospect-task-modal/retrospect-task-modal.component';

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
    private params: any;
    private columnDefs: any;
    private gridApi: GridApi;
    private columnApi: ColumnApi;

    constructor(
        private snackBar: MatSnackBar,
        public dialog: MatDialog,
        private retrospectiveService: RetrospectiveService
    ) {
        this.columnDefs = this.createColumnDefs();
        this.setGridOptions();
    }

    @HostListener('window:resize') onResize() {
        if (this.gridApi) {
            setTimeout(() => {
                this.gridApi.sizeColumnsToFit();
            });
        }
    }

    ngOnInit(): void {
        this.autoRefreshCurrentState = this.enableRefresh;
    }

    ngOnChanges(changes: SimpleChanges): void {
        if(changes.isTabActive) {
            this.isTabActive = changes.isTabActive.currentValue
        }
        if (this.gridApi && this.isTabActive) {
            setTimeout(() => {
                this.gridApi.sizeColumnsToFit();
                this.getSprintTaskSummary(true);
            });
        }
        if (changes.enableRefresh) {
            this.enableRefresh = changes.enableRefresh.currentValue;
            this.autoRefreshCurrentState = changes.enableRefresh.currentValue;
            if (this.autoRefreshCurrentState && this.isTabActive) {
                this.getSprintTaskSummary(true);
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
                            err.data.error.charAt(0).toUpperCase() + err.data.error.substr(1) || API_RESPONSE_MESSAGES.autoRefreshFailure,
                            '', {duration: SNACKBAR_DURATION});
                    } else {
                        this.snackBar.open(
                            err.data.error.charAt(0).toUpperCase() + err.data.error.substr(1) || API_RESPONSE_MESSAGES.getSprintTaskSummaryError,
                            '', {duration: SNACKBAR_DURATION});
                    }
                }
            );
    }

    retrospectSprint(sprintTaskSummaryData) {
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

    private createColumnDefs() {
        return [
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
    }
}
