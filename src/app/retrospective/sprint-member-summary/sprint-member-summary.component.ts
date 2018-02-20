import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ColumnApi, GridApi, GridOptions } from 'ag-grid';
import { MatDialog, MatSnackBar } from '@angular/material';
import { RetrospectiveService } from '../../shared/services/retrospective.service';
import { BasicModalComponent } from '../../shared/basic-modal/basic-modal.component';
import {
    API_RESPONSE_MESSAGES, RATING_STATES, RATING_STATES_LABEL, SNACKBAR_DURATION,
    SPRINT_STATES
} from '../../../constants/app-constants';
import { RatingRendererComponent } from '../../shared/ag-grid-renderers/rating-renderer/rating-renderer.component';
import { NumericCellEditorComponent } from '../../shared/ag-grid-editors/numeric-cell-editor/numeric-cell-editor.component';
import { SelectCellEditorComponent } from '../../shared/ag-grid-editors/select-cell-editor/select-cell-editor.component';
import {
    ClickableButtonRendererComponent
} from '../../shared/ag-grid-renderers/clickable-button-renderer/clickable-button-renderer.component';

@Component({
    selector: 'app-sprint-member-summary',
    templateUrl: './sprint-member-summary.component.html',
    styleUrls: ['./sprint-member-summary.component.scss']
})
export class SprintMemberSummaryComponent implements OnInit, OnChanges {
    retroMembers = [];
    memberIDs = [];
    selectedMemberID: any;
    gridOptions: GridOptions;
    sprintStates = SPRINT_STATES;
    ratingStates = RATING_STATES;

    private columnDefs: any;
    private params: any;
    private gridApi: GridApi;
    private columnApi: ColumnApi;

    @Input() retrospectiveID;
    @Input() sprintID;
    @Input() sprintStatus;
    @Input() sprintDays: any;

    constructor(private retrospectiveService: RetrospectiveService,
                private snackBar: MatSnackBar,
                public dialog: MatDialog) { }

    ngOnInit() {
        this.getRetroMembers();
        this.columnDefs = this.createColumnDefs(this.sprintStatus);
        this.setGridOptions();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (this.columnApi && this.gridApi && changes.sprintStatus.currentValue === this.sprintStates.FROZEN) {
            this.columnDefs = this.createColumnDefs(changes.sprintStatus.currentValue);
            this.gridApi.setColumnDefs(this.columnDefs);
        }
    }

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
                'ratingEditor': SelectCellEditorComponent,
                'ratingRenderer': RatingRendererComponent,
                'deleteButtonRenderer': ClickableButtonRendererComponent,
                'numericEditor': NumericCellEditorComponent
            }
        };
    }

    onGridReady(params) {
        this.params = params;
        this.gridApi = params.api;
        this.columnApi = params.columnApi;
        this.getSprintMemberSummary();
    }

    getSprintMemberSummary() {
        this.retrospectiveService.getSprintMemberSummary()
            .subscribe(
                data => {
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
        const nameColumn = [
            {
                headerName: 'Name',
                field: 'Name',
                width: 150,
                pinned: true
            }
        ];

        const velocitiesColumns = [
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
            }
        ];

        if (sprintStatus === this.sprintStates.FROZEN) {
            columnDefs = [
                ...nameColumn,
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
                ...velocitiesColumns,
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
                ...nameColumn,
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
                            } else if (cellParams.newValue >= this.sprintDays) {
                                this.snackBar.open(API_RESPONSE_MESSAGES.vacationTimeError, '', {duration: SNACKBAR_DURATION});
                                this.revertCellValue(cellParams);
                            } else {
                                this.updateSprintMember(cellParams);
                            }
                        }
                    }
                },
                ...velocitiesColumns,
                {
                    headerName: 'Rating',
                    field: 'Rating',
                    width: 150,
                    editable: true,
                    cellEditor: 'ratingEditor',
                    cellEditorParams: {
                        labels: RATING_STATES_LABEL,
                        values: [
                            this.ratingStates.UGLY,
                            this.ratingStates.BAD,
                            this.ratingStates.OKAY,
                            this.ratingStates.GOOD,
                            this.ratingStates.NOTABLE
                        ]
                    },
                    cellRenderer: 'ratingRenderer',
                    onCellValueChanged: (cellParams) => {
                        if ((cellParams.newValue !== cellParams.oldValue) &&
                            (cellParams.newValue >= this.ratingStates.UGLY && cellParams.newValue <= this.ratingStates.NOTABLE)) {
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
                    cellRendererParams: {
                        label: 'delete',
                        onClick: this.deleteSprintMember.bind(this)
                    },
                    width: 180
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
        this.retrospectiveService.updateSprintMember(params.data).subscribe(
            member => {
                this.gridApi.updateRowData({update: [member]});
                this.snackBar.open(API_RESPONSE_MESSAGES.memberUpdated, '', {duration: SNACKBAR_DURATION});
            },
            () => {
                this.snackBar.open(API_RESPONSE_MESSAGES.updateSprintMemberError, '', {duration: SNACKBAR_DURATION});
                this.revertCellValue(params);
            });
    }

    revertCellValue(params) {
        const rowData = params.data;
        rowData[params.colDef.headerName] = params.oldValue;
        this.gridApi.updateRowData({update: [rowData]});
    }
}
