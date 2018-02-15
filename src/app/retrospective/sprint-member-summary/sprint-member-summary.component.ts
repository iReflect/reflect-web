import { Component, Input, OnInit } from '@angular/core';
import { ColumnApi, GridApi, GridOptions } from 'ag-grid';
import { MatDialog, MatSnackBar } from '@angular/material';
import { RetrospectiveService } from '../../shared/services/retrospective.service';
import { BasicModalComponent } from '../../shared/basic-modal/basic-modal.component';
import { API_RESPONSE_MESSAGES, SNACKBAR_DURATION, SPRINT_STATES } from '../../../constants/app-constants';
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
    retroMembers: any[];
    memberIDs: any[] = [];
    selectedMemberID: any;
    gridOptions: GridOptions;
    sprintStates = SPRINT_STATES;

    private columnDefs: any[];
    private params: any;
    private gridApi: GridApi;
    private columnApi: ColumnApi;
    private sprintTime: any;

    @Input() retrospectiveID;
    @Input() sprintID;
    @Input() sprintStatus;

    constructor(private snackBar: MatSnackBar,
                public dialog: MatDialog,
                private retrospectiveService: RetrospectiveService) {
        this.getRetroMembers();
        this.columnDefs = this.createColumnDefs(this.sprintStatus);
        this.setGridOptions();
    }

    ngOnInit() { }

    getRetroMembers() {
        this.retrospectiveService.getRetroMembers(this.retrospectiveID).subscribe(
            data => {
                this.retroMembers = data.members;
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
        this.retrospectiveService.getSprintMemberSummary()
            .subscribe(
                data => {
                    this.sprintTime = data['Sprint']['TotalTime'];
                    this.gridApi.setRowData(data['Sprint']['Members']);
                    data['Sprint']['Members'].map(member => {
                        this.memberIDs.push(member['ID']);
                        return member;
                    });
                },
                () => {
                    this.snackBar.open(API_RESPONSE_MESSAGES.getSprintMemberSummaryError, '', {duration: SNACKBAR_DURATION});
                }
            );
    }

    private createColumnDefs(sprintStatus) {
        let columnDefs;
        if (sprintStatus === this.sprintStates.FROZEN) {
            columnDefs = [
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
                    width: 125,
                    valueFormatter: (params) => params.value + '%'
                },
                {
                    headerName: 'Expectation',
                    field: 'Expectation',
                    width: 130,
                    valueFormatter: (params) => params.value + '%'
                },
                {
                    headerName: 'Vacations',
                    field: 'Vacations',
                    width: 125,
                    valueFormatter: (params) => params.value + (params.value === 1 ? ' day' : ' days')
                },
                {
                    headerName: 'Expected Velocity',
                    field: 'Expected Velocity',
                    width: 183,
                    filter: 'agNumberColumnFilter'
                },
                {
                    headerName: 'Actual Velocity',
                    field: 'Actual Velocity',
                    width: 183,
                    filter: 'agNumberColumnFilter'
                },
                {
                    headerName: 'Rating',
                    field: 'Rating',
                    width: 150,
                    cellRenderer: 'ratingRenderer'
                },
                {
                    headerName: 'Comments',
                    field: 'Comments',
                    width: 500,
                    tooltip: (params) => params.value
                }
            ];
        } else {
            columnDefs = [
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
                    width: 125,
                    valueParser: 'Number(newValue)',
                    cellEditor: 'numericEditor',
                    valueFormatter: (params) => params.value + '%',
                    onCellValueChanged: (cellParams) => {
                        if (cellParams.newValue !== cellParams.oldValue) {
                            if (cellParams.newValue >= 0 && cellParams.newValue <= 100) {
                                this.updateSprintMember(cellParams);
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
                    width: 130,
                    valueParser: 'Number(newValue)',
                    cellEditor: 'numericEditor',
                    valueFormatter: (params) => params.value + '%',
                    onCellValueChanged: (cellParams) => {
                        if (cellParams.newValue !== cellParams.oldValue) {
                            if (cellParams.newValue >= 0 && cellParams.newValue <= 100) {
                                this.updateSprintMember(cellParams);
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
                    width: 125,
                    valueParser: 'Number(newValue)',
                    filter: 'agNumberColumnFilter',
                    cellEditor: 'numericEditor',
                    valueFormatter: (params) => params.value + (params.value === 1 ? ' day' : ' days'),
                    onCellValueChanged: (cellParams) => {
                        if (cellParams.newValue !== cellParams.oldValue) {
                            if (cellParams.newValue < 0) {
                                this.snackBar.open(API_RESPONSE_MESSAGES.vacationNumberError, '', {duration: SNACKBAR_DURATION});
                                this.revertCellValue(cellParams);
                            } else if (cellParams.newValue >= this.sprintTime) {
                                this.snackBar.open(API_RESPONSE_MESSAGES.vacationTimeError, '', {duration: SNACKBAR_DURATION});
                                this.revertCellValue(cellParams);
                            } else {
                                this.updateSprintMember(cellParams);
                            }
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
                    headerName: 'Actual Velocity',
                    field: 'Actual Velocity',
                    width: 183,
                    filter: 'agNumberColumnFilter'
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
                            this.updateSprintMember(cellParams);
                        }
                    }
                },
                {
                    headerName: 'Comments',
                    field: 'Comments',
                    width: 500,
                    filter: 'text',
                    cellEditor: 'agLargeTextCellEditor',
                    tooltip: (params) => params.value,
                    editable: true,
                    onCellValueChanged: (cellParams) => {
                        if (cellParams.newValue !== cellParams.oldValue) {
                            this.updateSprintMember(cellParams);
                        }
                    }
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
        }
        return columnDefs;
    }

    addSprintMember() {
        if (this.selectedMemberID === undefined) {
            this.snackBar.open(API_RESPONSE_MESSAGES.memberNotSelectedError, '', {duration: SNACKBAR_DURATION});
        } else if (this.memberIDs.indexOf(this.selectedMemberID) !== -1) {
            this.snackBar.open(API_RESPONSE_MESSAGES.memberAlreadyPresent, '', {duration: SNACKBAR_DURATION});
        } else {
            this.retrospectiveService.addSprintMember(this.selectedMemberID, this.sprintID)
                .subscribe(
                    newMember => {
                        this.gridApi.updateRowData({ add: [newMember] });
                        this.memberIDs.push(this.selectedMemberID);
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
                            this.memberIDs = this.memberIDs.filter(ID => ID !== member.ID);
                        },
                        () => {
                            this.snackBar.open(API_RESPONSE_MESSAGES.deleteSprintMemberError, '', {duration: SNACKBAR_DURATION});
                        }
                    );
            }
        });
    }

    updateSprintMember(params) {
        const cellData = params.data;
        this.retrospectiveService.updateSprintMember(cellData).subscribe(
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
