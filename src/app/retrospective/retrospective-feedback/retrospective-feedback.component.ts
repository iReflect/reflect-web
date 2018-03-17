import { Component, OnInit } from '@angular/core';
import { ColumnApi, GridApi, GridOptions } from 'ag-grid';

@Component({
  selector: 'app-retrospective-feedback',
  templateUrl: './retrospective-feedback.component.html',
  styleUrls: ['./retrospective-feedback.component.scss']
})
export class RetrospectiveFeedbackComponent implements OnInit {

    gridOptions: GridOptions;

    private columnDefs: any;
    private params: any;
    private gridApi: GridApi;
    private columnApi: ColumnApi;

    private static createColumnDefs() {
        return [
            {
                headerName: 'Text',
                field: 'Text',
                minWidth: 160,

            },
            {
                headerName: 'Scope',
                field: 'Scope',
                minWidth: 160,

            },
            {
                headerName: 'Assignee',
                field: 'Assignee',
                minWidth: 160,

            },
            {
                headerName: 'Added At',
                field: 'AddedAt',
                minWidth: 160,

            }, {
                headerName: 'Resolved At',
                field: 'ResolvedAt',
                minWidth: 160,

            },
            {
                headerName: 'Expected At',
                field: 'ExpectedAt',
                minWidth: 160,

            },
            {
                headerName: 'Created By',
                field: 'CreatedBy',
                minWidth: 160,

            },
            {
                headerName: 'Mark Resolved',
                minWidth: 160,

            },
        ];
    }

    constructor() { }

    ngOnInit() {
        this.columnDefs = RetrospectiveFeedbackComponent.createColumnDefs();
        this.setGridOptions();
    }

    setGridOptions() {
        this.gridOptions = <GridOptions>{
            columnDefs: this.columnDefs,
            defaultColDef: {
                width: 150,
            },
            rowHeight: 60,
            singleClickEdit: true,
            frameworkComponents: {}
        };
    }

    onGridReady(params) {
        this.params = params;
        this.gridApi = params.api;
        this.columnApi = params.columnApi;
        this.gridApi.setRowData([]);
    }

}
