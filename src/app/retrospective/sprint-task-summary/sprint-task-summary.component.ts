import { Component, Input } from '@angular/core';
import { ColumnApi, GridApi, GridOptions } from 'ag-grid';
import { RetrospectiveService } from '../../shared/services/retrospective.service';
import { MatDialog, MatSnackBar } from '@angular/material';
import { API_RESPONSE_MESSAGES, SNACKBAR_DURATION } from '../../../constants/app-constants';
import { RetrospectTaskModalComponent } from '../retrospect-task-modal/retrospect-task-modal.component';
import {
    ClickableButtonRendererComponent
} from '../../shared/ag-grid-renderers/clickable-button-renderer/clickable-button-renderer.component';

@Component({
    selector: 'app-sprint-task-summary',
    templateUrl: './sprint-task-summary.component.html',
    styleUrls: ['./sprint-task-summary.component.scss']
})
export class SprintTaskSummaryComponent {
    gridOptions: GridOptions;
    private params: any;
    private columnDefs: any;
    private gridApi: GridApi;
    private columnApi: ColumnApi;
    @Input() retrospectiveID;
    @Input() sprintID;
    @Input() sprintStatus;

    constructor(private snackBar: MatSnackBar,
                public dialog: MatDialog,
                private retrospectiveService: RetrospectiveService) {
        this.columnDefs = this.createColumnDefs();
        this.setGridOptions();
    }

    setGridOptions() {
        this.gridOptions = <GridOptions>{
            columnDefs: this.columnDefs,
            rowHeight: 48,
            frameworkComponents: {
                'retrospectButtonRenderer': ClickableButtonRendererComponent
            }
        };
    }

    onGridReady(params) {
        this.params = params;
        this.gridApi = params.api;
        this.columnApi = params.columnApi;
        this.getSprintTaskSummary();
    }

    getSprintTaskSummary() {
        this.retrospectiveService.getSprintTaskSummary(this.retrospectiveID, this.sprintID)
            .subscribe(
                response => {
                    this.gridApi.setRowData(response.data.Tasks);
                },
                () => {
                    this.snackBar.open(API_RESPONSE_MESSAGES.getSprintTaskSummaryError, '', {duration: SNACKBAR_DURATION});
                }
            );
    }

    private createColumnDefs() {
        const columnDefs = [
            {
                headerName: 'Task ID',
                field: 'TaskID',
                width: 106,
                pinned: true
            },
            {
                headerName: 'Task Summary',
                field: 'Summary',
                width: 300,
                tooltip: (params) => params.value,
                pinned: true
            },
            {
                headerName: 'Assignee',
                field: 'Assignee',
                width: 235
            },
            {
                headerName: 'Estimates',
                field: 'Estimate',
                width: 235
            },
            {
                headerName: 'Status',
                field: 'Status',
                width: 230
            },
            {
                headerName: 'Sprint Hours',
                field: 'SprintTime',
                valueFormatter: (params) => (params.value / 60).toFixed(2),
                width: 130
            },
            {
                headerName: 'Total Time Spent',
                field: 'TotalTime',
                valueFormatter: (params) => (params.value / 60).toFixed(2),
                width: 150
            },
            {
                headerName: 'Story Type',
                field: 'Type',
                width: 190
            },
            {
                headerName: 'Retrospect',
                cellRenderer: 'retrospectButtonRenderer',
                cellRendererParams: {
                    label: 'Retrospect',
                    onClick: this.retrospectSprint.bind(this)
                },
                width: 180
            }
        ];
        return columnDefs;
    }

    retrospectSprint(sprintTaskSummaryData) {
        const dialogRef = this.dialog.open(RetrospectTaskModalComponent, {
            width: '90%',
            data: {
                taskDetails: sprintTaskSummaryData,
                sprintID: this.sprintID,
                retrospectiveID: this.retrospectiveID,
                sprintStatus: this.sprintStatus
            },
            maxWidth: 950,
        });
    }
}
