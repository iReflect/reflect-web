import { Component, Input, OnInit } from '@angular/core';
import { ColumnApi, GridApi, GridOptions } from 'ag-grid';
import { MatDialog, MatSnackBar } from '@angular/material';
import { RetrospectiveService } from '../../shared/services/retrospective.service';
import { BasicModalComponent } from '../../shared/basic-modal/basic-modal.component';
import { API_RESPONSE_MESSAGES, SNACKBAR_DURATION } from '../../../constants/app-constants';
import { RatingRendererComponent } from '../../shared/ag-grid-renderers/rating-renderer/rating-renderer.component';
import { RatingEditorComponent } from '../../shared/ag-grid-editors/rating-editor/rating-editor.component';
import { DeleteButtonRendererComponent } from '../../shared/ag-grid-renderers/delete-button-renderer/delete-button-renderer.component';
import { NumericCellEditorComponent } from '../../shared/ag-grid-editors/numeric-cell-editor/numeric-cell-editor.component';

@Component({
    selector: 'app-sprint-member-summary',
    templateUrl: './sprint-member-summary.component.html',
    styleUrls: ['./sprint-member-summary.component.scss']
})
export class SprintMemberSummaryComponent implements OnInit {
    members: any[];
    selectedMemberID: any;
    gridOptions: GridOptions;

    private columnDefs: any[];
    private params: any;
    private gridApi: GridApi;
    private columnApi: ColumnApi;
    private sprintTime: any;

    params: any;
    members: any[];
    gridOptions: GridOptions;
    rowData: any[];
    columnDefs: any[];
    private gridApi: GridApi;
    private columnApi: ColumnApi;
    sprintTime: any;
    selectedMemberID: any;

    @Input() retrospectiveID;
    @Input() sprintID;

    constructor(private snackBar: MatSnackBar,
                public dialog: MatDialog,
                private retrospectiveService: RetrospectiveService) {
        this.getRetroMembers();
        this.columnDefs = this.createColumnDefs();
        this.setGridOptions();
    }

    ngOnInit() { }

    getRetroMembers() {
        this.retrospectiveService.getRetroMembers(this.retrospectiveID).subscribe(
            data => {
                this.members = data.members;
            },
            () => {
                this.snackBar.open(API_RESPONSE_MESSAGES.getRetrospectiveMembersError, '', {duration: SNACKBAR_DURATION});
            }
        );
    }

    setGridOptions() {
        this.gridOptions = <GridOptions>{
            columnDefs: this.columnDefs,
            rowHeight: 48,
            frameworkComponents: {
                'ratingEditor': RatingEditorComponent,
                'ratingRenderer': RatingRendererComponent,
                'deleteButtonRenderer': DeleteButtonRendererComponent,
                'numericEditor': NumericCellEditorComponent
            }
        };
    }

    onGridReady(params) {
        this.params = params;
        this.gridApi = params.api;
        this.columnApi = params.columnApi;
        this.createRowData();
    }

    createRowData() {
        this.retrospectiveService.getSprintMemberDetails()
            .subscribe(
                data => {
                    this.gridApi.setRowData(data['Sprint']['Members']);
                    this.sprintTime = data['Sprint']['TotalTime'];
                },
                () => {
                    this.snackBar.open(API_RESPONSE_MESSAGES.getSprintMemberDetails, '', {duration: SNACKBAR_DURATION});
                }
            );
    }

    private createColumnDefs() {
        const columnDefs = [
            {
                headerName: 'Name',
                field: 'Name',
                width: 150,
                pinned: true
            },
            {
                headerName: 'Designation',
                field: 'Designation',
                width: 150
            },
            {
                headerName: 'Allocation',
                field: 'Allocation',
                editable: true,
                width: 235,
                valueParser: 'Number(newValue)',
                cellEditor: 'numericEditor',
                valueFormatter: (params) => params.value + '%',
                onCellValueChanged: (cellParams) => {
                    if (cellParams.newValue !== cellParams.oldValue) {
                        if (cellParams.newValue >= 0 && cellParams.newValue <= 100) {
                            this.updateMemberDetails(cellParams);
                        } else {
                            this.snackBar.open(API_RESPONSE_MESSAGES.allocationNumberError, '', {duration: SNACKBAR_DURATION});
                            this.revertCellValue(cellParams);
                        }
                    }
                }
            },
            {
                headerName: 'Expectation',
                field: 'Expectation',
                editable: true,
                width: 235,
                valueParser: 'Number(newValue)',
                cellEditor: 'numericEditor',
                valueFormatter: (params) => params.value + '%',
                onCellValueChanged: (cellParams) => {
                    if (cellParams.newValue !== cellParams.oldValue) {
                        if (cellParams.newValue >= 0 && cellParams.newValue <= 100) {
                            this.updateMemberDetails(cellParams);
                        } else {
                            this.snackBar.open(API_RESPONSE_MESSAGES.expectationNumberError, '', {duration: SNACKBAR_DURATION});
                            this.revertCellValue(cellParams);
                        }
                    }
                }
            },
            {
                headerName: 'Vacations',
                field: 'Vacations',
                editable: true,
                width: 130,
                valueParser: 'Number(newValue)',
                filter: 'agNumberColumnFilter',
                cellEditor: 'numericEditor',
                valueFormatter: (params) => params.value + (params.value === 1 ? ' day' : ' days'),
                onCellValueChanged: (cellParams) => {
                    if (cellParams.newValue !== cellParams.oldValue) {
                        if (cellParams.newValue >= 0 && cellParams.newValue < this.sprintTime) {
                            this.updateMemberDetails(cellParams);
                        } else {
                            if (cellParams.newValue === NaN || cellParams.newValue < 0) {
                                this.snackBar.open(API_RESPONSE_MESSAGES.vacationNumberError, '', {duration: SNACKBAR_DURATION});
                            } else if (cellParams.newValue >= this.sprintTime) {
                                this.snackBar.open(API_RESPONSE_MESSAGES.vacationTimeError, '', {duration: SNACKBAR_DURATION});
                            }
                            this.revertCellValue(cellParams);
                        }
                    }
                }
            },
            {
                headerName: 'Comments',
                field: 'Comments',
                width: 500,
                filter: 'text',
                cellEditor: 'agLargeTextCellEditor',
                editable: true,
                tooltip: (params) => params.value,
                onCellValueChanged: (cellParams) => {
                    if (cellParams.newValue !== cellParams.oldValue) {
                        this.updateMemberDetails(cellParams);
                    }
                }
            },
            {
                headerName: 'Rating',
                field: 'Rating',
                width: 150,
                editable: true,
                cellEditor: 'ratingEditor',
                cellEditorParams: {
                    values: [0, 1, 2, 3, 4],
                },
                cellRenderer: 'ratingRenderer',
                onCellValueChanged: (cellParams) => {
                    if (cellParams.newValue !== cellParams.oldValue) {
                        this.updateMemberDetails(cellParams);
                    }
                }
            },
            {
                headerName: 'Expected Velocity',
                field: 'Expected Velocity',
                width: 183,
                filter: 'agNumberColumnFilter'
            },
            {
                headerName: 'Average Velocity',
                field: 'Actual Velocity',
                width: 183,
                filter: 'agNumberColumnFilter'
            },
            {
                headerName: 'Delete Row',
                cellRenderer: 'deleteButtonRenderer',
                width: 180,
                onCellValueChanged: (cellParams) => {
                    this.deleteSprintMember(cellParams.data);
                }
            }
        ];
        return columnDefs;
    }

    addNewMember() {
        if (this.selectedMemberID === undefined) {
            this.snackBar.open(API_RESPONSE_MESSAGES.memberNotSelectedError, '', {duration: SNACKBAR_DURATION});
        } else {
            this.retrospectiveService.getNewMemberDetails(this.selectedMemberID, this.sprintID)
                .subscribe(
                    newMember => {
                        this.gridApi.updateRowData({ add: [newMember] });
                    },
                    () => {
                        this.snackBar.open(API_RESPONSE_MESSAGES.addSprintMemberError, '', {duration: SNACKBAR_DURATION});
                    }
                );
        }
    }

    deleteSprintMember(member) {
        const dialogRef = this.dialog.open(BasicModalComponent, {
            data: {
                content: 'Are you sure you want to delete ' + member.Name + '?',
                confirmBtn: 'Yes',
                cancelBtn: 'Cancel'
            },
            disableClose: true
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.retrospectiveService.deleteMember(member.ID)
                    .subscribe(
                        () => {
                            this.gridApi.updateRowData({ remove: [member] });
                        },
                        () => {
                            this.snackBar.open(API_RESPONSE_MESSAGES.deleteSprintMemberError, '', {duration: SNACKBAR_DURATION});
                        }
                    );
            }
        });
    }

    updateMemberDetails(params) {
        const cellData = params.data;
        this.retrospectiveService.updateMember(cellData).subscribe(
            () => {
                this.gridApi.updateRowData({update: [cellData]});
                this.snackBar.open(API_RESPONSE_MESSAGES.memberUpdated, '', {duration: SNACKBAR_DURATION});
            },
            () => {
                this.snackBar.open(API_RESPONSE_MESSAGES.updateSprintMemberError, '', {duration: SNACKBAR_DURATION});
                this.revertCellValue(params);
            });
    }

    revertCellValue(params) {
        const cellData = params.data;
        cellData[params.colDef.headerName] = params.oldValue;
        this.gridApi.updateRowData({update: [cellData]});
    }
}
