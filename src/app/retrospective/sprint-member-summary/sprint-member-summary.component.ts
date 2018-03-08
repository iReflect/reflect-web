import { Component, HostListener, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
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
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/observable/interval';

@Component({
    selector: 'app-sprint-member-summary',
    templateUrl: './sprint-member-summary.component.html',
    styleUrls: ['./sprint-member-summary.component.scss']
})
export class SprintMemberSummaryComponent implements OnInit, OnChanges, OnDestroy {
    retroMembers = [];
    memberIDs = [];
    selectedMemberID: any;
    enableRefresh = true;
    gridOptions: GridOptions;
    sprintStates = SPRINT_STATES;
    ratingStates = RATING_STATES;
    destroy$: Subject<boolean> = new Subject<boolean>();

    private columnDefs: any;
    private params: any;
    private gridApi: GridApi;
    private columnApi: ColumnApi;

    @Input() retrospectiveID;
    @Input() sprintID;
    @Input() sprintStatus;
    @Input() sprintDays: any;
    @Input() isTabActive: boolean;

    @HostListener('window:resize') onResize() {
        if (this.gridApi && this.isTabActive) {
            setTimeout(() => {
                this.gridApi.sizeColumnsToFit();
            });
        }
    }

    constructor(private retrospectiveService: RetrospectiveService,
                private snackBar: MatSnackBar,
                public dialog: MatDialog) { }

    ngOnInit() {
        this.getRetroMembers();
        this.columnDefs = this.createColumnDefs(this.sprintStatus);
        this.setGridOptions();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (this.gridApi && changes.sprintStatus && changes.sprintStatus.currentValue === this.sprintStates.FROZEN) {
            this.columnDefs = this.createColumnDefs(changes.sprintStatus.currentValue);
            this.gridApi.setColumnDefs(this.columnDefs);
        }
        if (this.gridApi && changes.isTabActive && changes.isTabActive.currentValue) {
            setTimeout(() => {
                this.gridApi.sizeColumnsToFit();
            });
        }
    }

    ngOnDestroy() {
        this.enableRefresh = false;
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
    }

    getRetroMembers() {
        this.retrospectiveService.getRetroMembers(this.retrospectiveID).subscribe(
            response => {
                this.retroMembers = response.data.Members;
            },
            () => {
                this.snackBar.open(API_RESPONSE_MESSAGES.getRetrospectiveMembersError, '', {duration: SNACKBAR_DURATION});
            }
        );
    }

    setGridOptions() {
        this.gridOptions = <GridOptions>{
            columnDefs: this.columnDefs,
            defaultColDef: {
                width: 100,
            },
            rowHeight: 48,
            singleClickEdit: true,
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
        this.getSprintMemberSummary(false);
        Observable.interval(5000)
            .takeUntil(this.destroy$)
            .subscribe(() => {
                if (this.enableRefresh && this.isTabActive) {
                    this.getSprintMemberSummary(true);
                }
            });
    }

    onCellEditingStarted() {
        this.enableRefresh = false;
    }

    onCellEditingStopped() {
        this.enableRefresh = true;
    }

    getSprintMemberSummary(isRefresh) {
        this.retrospectiveService.getSprintMemberSummary(this.retrospectiveID, this.sprintID)
            .subscribe(
                response => {
                    const members = response.data.Members;
                    this.gridApi.setRowData(members);
                    this.memberIDs = [];
                    members.forEach(member => {
                        this.memberIDs.push(member.ID);
                    });
                    if (!isRefresh && this.isTabActive) {
                        this.gridApi.sizeColumnsToFit();
                    }
                },
                () => {
                    if (isRefresh) {
                        this.snackBar.open(API_RESPONSE_MESSAGES.autoRefreshFailure, '', {duration: SNACKBAR_DURATION});
                    } else {
                        this.snackBar.open(API_RESPONSE_MESSAGES.getSprintMemberSummaryError, '', {duration: SNACKBAR_DURATION});
                    }
                }
            );
    }

    private commentsValueFormatter(cellParams) {
        const comment = cellParams.value.trim();
        const newLineIndex = comment.indexOf('\n');
        if (newLineIndex !== -1) {
            return comment.substr(0, newLineIndex) + '...';
        }
        return comment;
    }

    private supressKeyboardEvent(event) {
        if (event.editing) {
            return true;
        }
    }

    private createColumnDefs(sprintStatus) {
        let columnDefs;
        const nameColumn = [
            {
                headerName: 'Name',
                colId: 'Name',
                valueGetter: (cellParams) => {
                    return (cellParams.data.FirstName + ' ' + cellParams.data.LastName).trim();
                },
                minWidth: 160,
                pinned: true

            }
        ];

        const velocitiesColumns = [
            {
                headerName: 'Expected Velocity',
                field: 'ExpectedVelocity',
                minWidth: 165,
                filter: 'agNumberColumnFilter'
            },
            {
                headerName: 'Actual Velocity',
                field: 'ActualVelocity',
                minWidth: 165,
                filter: 'agNumberColumnFilter'
            }
        ];

        if (sprintStatus === this.sprintStates.FROZEN) {
            columnDefs = [
                ...nameColumn,
                {
                    headerName: 'Allocation',
                    field: 'AllocationPercent',
                    minWidth: 125,
                    valueFormatter: (cellParams) => cellParams.value + '%'
                },
                {
                    headerName: 'Expectation',
                    field: 'ExpectationPercent',
                    minWidth: 130,
                    valueFormatter: (cellParams) => cellParams.value + '%'
                },
                {
                    headerName: 'Vacations',
                    field: 'Vacations',
                    minWidth: 125,
                    valueFormatter: (cellParams) => cellParams.value + (cellParams.value === 1 ? ' day' : ' days')
                },
                ...velocitiesColumns,
                {
                    headerName: 'Rating',
                    field: 'Rating',
                    minWidth: 150,
                    cellRenderer: 'ratingRenderer'
                },
                {
                    headerName: 'Comments',
                    field: 'Comment',
                    minWidth: 300,
                    tooltipField: 'Comment',
                    valueFormatter: (cellParams) => this.commentsValueFormatter(cellParams)
                }
            ];
        } else {
            columnDefs = [
                ...nameColumn,
                {
                    headerName: 'Allocation',
                    field: 'AllocationPercent',
                    editable: true,
                    minWidth: 125,
                    valueParser: 'Number(newValue)',
                    cellEditor: 'numericEditor',
                    cellEditorParams: {
                        minValue: 0
                    },
                    valueFormatter: (cellParams) => cellParams.value + '%',
                    onCellValueChanged: (cellParams) => {
                        if (cellParams.newValue !== cellParams.oldValue) {
                            if (cellParams.newValue >= 0) {
                                this.updateSprintMember(cellParams);
                            } else {
                                this.snackBar.open(API_RESPONSE_MESSAGES.allocationNegativeError, '', {duration: SNACKBAR_DURATION});
                                this.revertCellValue(cellParams);
                            }
                        }
                    },
                    suppressKeyboardEvent: (event) => this.supressKeyboardEvent(event)
                },
                {
                    headerName: 'Expectation',
                    field: 'ExpectationPercent',
                    editable: true,
                    minWidth: 130,
                    valueParser: 'Number(newValue)',
                    cellEditor: 'numericEditor',
                    cellEditorParams: {
                        minValue: 0
                    },
                    valueFormatter: (cellParams) => cellParams.value + '%',
                    onCellValueChanged: (cellParams) => {
                        if (cellParams.newValue !== cellParams.oldValue) {
                            if (cellParams.newValue >= 0) {
                                this.updateSprintMember(cellParams);
                            } else {
                                this.snackBar.open(API_RESPONSE_MESSAGES.expectationNegativeError, '', {duration: SNACKBAR_DURATION});
                                this.revertCellValue(cellParams);
                            }
                        }
                    },
                    suppressKeyboardEvent: (event) => this.supressKeyboardEvent(event)
                },
                {
                    headerName: 'Vacations',
                    field: 'Vacations',
                    editable: true,
                    minWidth: 125,
                    valueParser: 'Number(newValue)',
                    filter: 'agNumberColumnFilter',
                    cellEditor: 'numericEditor',
                    cellEditorParams: {
                        minValue: 0,
                        maxValue: this.sprintDays
                    },
                    valueFormatter: (cellParams) => cellParams.value + (cellParams.value === 1 ? ' day' : ' days'),
                    onCellValueChanged: (cellParams) => {
                        if (cellParams.newValue !== cellParams.oldValue) {
                            if (cellParams.newValue < 0) {
                                this.snackBar.open(API_RESPONSE_MESSAGES.vacationNumberError, '', {duration: SNACKBAR_DURATION});
                                this.revertCellValue(cellParams);
                            } else if (cellParams.newValue > this.sprintDays) {
                                this.snackBar.open(API_RESPONSE_MESSAGES.vacationTimeError, '', {duration: SNACKBAR_DURATION});
                                this.revertCellValue(cellParams);
                            } else {
                                this.updateSprintMember(cellParams);
                            }
                        }
                    },
                    suppressKeyboardEvent: (event) => this.supressKeyboardEvent(event)
                },
                ...velocitiesColumns,
                {
                    headerName: 'Rating',
                    field: 'Rating',
                    minWidth: 150,
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
                    field: 'Comment',
                    minWidth: 300,
                    filter: 'text',
                    cellEditor: 'agLargeTextCellEditor',
                    tooltipField: 'Comment',
                    editable: true,
                    onCellValueChanged: (cellParams) => {
                        if (cellParams.newValue !== cellParams.oldValue) {
                            this.updateSprintMember(cellParams);
                        }
                    },
                    valueFormatter: (cellParams) => this.commentsValueFormatter(cellParams)
                },
                {
                    cellRenderer: 'deleteButtonRenderer',
                    cellRendererParams: {
                        useIcon: true,
                        icon: 'delete',
                        onClick: this.deleteSprintMember.bind(this)
                    },
                    minWidth: 100
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
            this.retrospectiveService.addSprintMember(this.retrospectiveID, this.sprintID, this.selectedMemberID)
                .subscribe(
                    response => {
                        this.gridApi.updateRowData({ add: [response.data] });
                        this.memberIDs.push(this.selectedMemberID);
                    },
                    () => {
                        this.snackBar.open(API_RESPONSE_MESSAGES.addSprintMemberError, '', {duration: SNACKBAR_DURATION});
                    }
                );
        }
    }

    updateSprintMember(params) {
        const memberData = params.data;
        this.retrospectiveService.updateSprintMember(this.retrospectiveID, this.sprintID, memberData).subscribe(
            response => {
                params.node.setData(response.data);
                this.snackBar.open(API_RESPONSE_MESSAGES.memberUpdated, '', {duration: SNACKBAR_DURATION});
            },
            () => {
                this.snackBar.open(API_RESPONSE_MESSAGES.updateSprintMemberError, '', {duration: SNACKBAR_DURATION});
                this.revertCellValue(params);
            });
    }

    revertCellValue(params) {
        const rowData = params.data;
        rowData[params.colDef.field] = params.oldValue;
        this.gridApi.updateRowData({update: [rowData]});
    }

    deleteSprintMember(member) {
        const dialogRef = this.dialog.open(BasicModalComponent, {
            data: {
                content: 'Are you sure you want to delete ' + (member.FirstName + ' ' + member.LastName).trim() + '?',
                confirmBtn: 'Yes',
                cancelBtn: 'Cancel'
            },
            disableClose: true
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.retrospectiveService.deleteSprintMember(this.retrospectiveID, this.sprintID, member.ID)
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
}
