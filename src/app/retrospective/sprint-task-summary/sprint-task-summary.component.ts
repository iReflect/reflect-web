import { Component, OnInit } from '@angular/core';
import { ColumnApi, GridApi, GridOptions } from 'ag-grid';
import { RetrospectiveService } from '../../shared/services/retrospective.service';
import { MatDialog, MatSnackBar } from '@angular/material';
import { RetrospectButtonRendererComponent } from '../../shared/ag-grid-renderers/retrospect-button-renderer/retrospect-button-renderer.component';
import { API_RESPONSE_MESSAGES, SNACKBAR_DURATION } from '../../../constants/app-constants';
import { BasicModalComponent } from '../../shared/basic-modal/basic-modal.component';
import { TooltipTextRendererComponent } from '../../shared/ag-grid-renderers/tooltip-text-renderer/tooltip-text-renderer.component';

@Component({
    selector: 'app-sprint-task-summary',
    templateUrl: './sprint-task-summary.component.html',
    styleUrls: ['./sprint-task-summary.component.scss']
})
export class SprintTaskSummaryComponent implements OnInit {
    params: any;
    gridOptions: GridOptions;
    public rowData: any[];
    public columnDefs: any[];
    private gridApi: GridApi;
    private columnApi: ColumnApi;

    constructor(private snackBar: MatSnackBar,
                public dialog: MatDialog,
                private retrospectiveService: RetrospectiveService) {
        this.columnDefs = this.createColumnDefs();
        this.gridOptions = <GridOptions>{
            rowData: this.rowData,
            columnDefs: this.columnDefs,
            rowHeight: 48,
            frameworkComponents: {
                'retrospectButtonRenderer': RetrospectButtonRendererComponent,
                'taskSummaryRenderer': TooltipTextRendererComponent
            }
        };
    }

    ngOnInit() {
    }

    onGridReady(params) {
        this.params = params;
        this.gridApi = params.api;
        this.columnApi = params.columnApi;
        this.createRowData();
    }


    createRowData() {
        this.retrospectiveService.getSprintTaskDetails()
            .subscribe(
                data => {
                    this.rowData = data['Sprint']['Tasks'];
                    this.gridApi.setRowData(this.rowData);
                },
                () => {
                    this.snackBar.open(API_RESPONSE_MESSAGES.getSprintMemberDetails, '', {duration: SNACKBAR_DURATION});
                }
            );
    }

    private createColumnDefs() {
        const columnDefs = [
            {
                headerName: 'Task ID',
                field: 'Task ID',
                width: 70,
                pinned: true
            },
            {
                headerName: 'Task Summary',
                field: 'Task Summary',
                width: 300,
                cellRenderer: 'taskSummaryRenderer',
                pinned: true
            },
            {
                headerName: 'Assignee',
                field: 'Assignee',
                width: 235
            },
            {
                headerName: 'Estimates',
                field: 'Estimates',
                width: 235
            },
            {
                headerName: 'Status',
                field: 'Status',
                width: 230
            },
            {
                headerName: 'Total Sprint Hours',
                field: 'Sprint Hours',
                width: 130
            },
            {
                headerName: 'Total Time Spent',
                field: 'Total Hours',
                width: 150
            },
            {
                headerName: 'Story Type',
                field: 'Story Type',
                width: 183
            },
            {
                headerName: 'Retrospect',
                cellRenderer: 'retrospectButtonRenderer',
                width: 180,
                onCellValueChanged: (cellParams) => {
                    this.retrospectSprint(cellParams);
                }
            }
        ];
        return columnDefs;
    }

    retrospectSprint(task) {
        const dialogRef = this.dialog.open(BasicModalComponent, {
            data: {
                content: 'Are you sure you want to retrospect this Task?',
                confirmBtn: 'Yes',
                cancelBtn: 'Cancel'
            },
            disableClose: true
        });

        dialogRef.afterClosed().subscribe(result => {
        });
    }
}
