import {Component, Input, OnInit} from '@angular/core';
import { ColumnApi, GridApi, GridOptions } from 'ag-grid';
import { RetrospectiveService } from '../../shared/services/retrospective.service';
import { MatDialog, MatSnackBar } from '@angular/material';
import { RetrospectButtonRendererComponent } from '../../shared/ag-grid-renderers/retrospect-button-renderer/retrospect-button-renderer.component';
import { API_RESPONSE_MESSAGES, SNACKBAR_DURATION } from '../../../constants/app-constants';
import { RetrospectTaskModalComponent } from '../retrospect-task-modal/retrospect-task-modal.component';

@Component({
    selector: 'app-sprint-task-summary',
    templateUrl: './sprint-task-summary.component.html',
    styleUrls: ['./sprint-task-summary.component.scss']
})
export class SprintTaskSummaryComponent implements OnInit {
    gridOptions: GridOptions;
    private params: any;
    private rowData: any[];
    private columnDefs: any[];
    private gridApi: GridApi;
    private columnApi: ColumnApi;
    @Input() retrospectiveID;
    @Input() sprintID;

    constructor(private snackBar: MatSnackBar,
                public dialog: MatDialog,
                private retrospectiveService: RetrospectiveService) {
        this.columnDefs = this.createColumnDefs();
        this.gridOptions = <GridOptions>{
            rowData: this.rowData,
            columnDefs: this.columnDefs,
            rowHeight: 48,
            frameworkComponents: {
                'retrospectButtonRenderer': RetrospectButtonRendererComponent
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
                width: 114,
                pinned: true
            },
            {
                headerName: 'Task Summary',
                field: 'Task Summary',
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
                field: 'Estimates',
                width: 235
            },
            {
                headerName: 'Status',
                field: 'Status',
                width: 230
            },
            {
                headerName: 'Sprint Hours',
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

    retrospectSprint(params) {
        const dialogRef = this.dialog.open(RetrospectTaskModalComponent, {
            width: '90%',
            data: {
                task: params.data,
                sprintID: this.sprintID,
                retrospectiveID: this.retrospectiveID
            },
            maxWidth: 950,
        });

        dialogRef.afterClosed().subscribe(result => {
            // TODO: change table data after changing values in modal
        });
    }
}
