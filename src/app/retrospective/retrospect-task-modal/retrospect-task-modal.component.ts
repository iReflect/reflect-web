import { Component, Inject } from '@angular/core';
import {
    API_RESPONSE_MESSAGES, RATING_STATES, RATING_STATES_LABEL, SNACKBAR_DURATION,
    SPRINT_STATES
} from '../../../constants/app-constants';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { RetrospectiveService } from '../../shared/services/retrospective.service';
import { RetrospectiveCreateComponent } from '../retrospective-create/retrospective-create.component';
import { GridOptions } from 'ag-grid';
import { RatingRendererComponent } from '../../shared/ag-grid-renderers/rating-renderer/rating-renderer.component';
import { NumericCellEditorComponent } from '../../shared/ag-grid-editors/numeric-cell-editor/numeric-cell-editor.component';
import { SelectCellEditorComponent } from '../../shared/ag-grid-editors/select-cell-editor/select-cell-editor.component';

@Component({
    selector: 'app-retrospect-task-modal',
    templateUrl: './retrospect-task-modal.component.html',
    styleUrls: ['./retrospect-task-modal.component.scss']
})
export class RetrospectTaskModalComponent {
    memberIDs = [];
    sprintMembers: any;
    taskDetails: any;
    selectedMemberID: number;
    gridOptions: GridOptions;
    sprintStates = SPRINT_STATES;
    ratingStates = RATING_STATES;

    private totalTaskPoints = 0;
    private params: any;
    private columnDefs: any;
    private gridApi: any;
    private columnApi: any;

    constructor(private retrospectiveService: RetrospectiveService,
                private snackBar: MatSnackBar,
                public dialogRef: MatDialogRef<RetrospectiveCreateComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any) {
        this.taskDetails = data.taskDetails;
        this.getSprintMembers();
        this.columnDefs = this.createColumnDefs(data.sprintStatus);
        this.setGridOptions();
    }

    getSprintMembers() {
        this.retrospectiveService.getSprintMembers(this.data.retrospectiveID, this.data.sprintID).subscribe(
            response => {
                this.sprintMembers = response.data.Members;
            },
            () => {
                this.snackBar.open(API_RESPONSE_MESSAGES.getSprintMembersError, '', {duration: SNACKBAR_DURATION});
            }
        );
    }

    setGridOptions() {
        this.gridOptions = <GridOptions>{
            columnDefs: this.columnDefs,
            rowHeight: 48,
            singleClickEdit: true,
            frameworkComponents: {
                'ratingEditor': SelectCellEditorComponent,
                'ratingRenderer': RatingRendererComponent,
                'numericEditor': NumericCellEditorComponent
            }
        };
    }

    onGridReady(params) {
        this.params = params;
        this.gridApi = params.api;
        this.columnApi = params.columnApi;
        this.getSprintTaskMemberSummary();
    }

    getSprintTaskMemberSummary() {
        this.retrospectiveService.getSprintTaskMemberSummary(this.data.retrospectiveID, this.data.sprintID, this.taskDetails.ID)
            .subscribe(
                response => {
                    this.gridApi.setRowData(response.data.Members);
                    response.data.Members.map(member => {
                        this.memberIDs.push(member.ID);
                        this.totalTaskPoints += member.TotalPoints;
                        return member;
                    });
                },
                () => {
                    this.snackBar.open(API_RESPONSE_MESSAGES.getSprintTaskMemberSummaryError, '', {duration: SNACKBAR_DURATION});
                    this.dialogRef.close();
                }
            );
    }

    private createColumnDefs(sprintStatus) {
        let columnDefs;
        const commonColumns = [
            {
                headerName: 'Name',
                colId: 'Name',
                valueGetter: (params) => {
                    return params.data.FirstName + ' ' + params.data.LastName;
                },
                width: 110,
                pinned: true
            },
            {
                headerName: 'Sprint Hours',
                field: 'SprintTime',
                width: 150
            },
            {
                headerName: 'Total Time',
                field: 'TotalTime',
                width: 140
            }
        ];
        const totalPointsColumn = [
            {
                headerName: 'Total Story Points',
                field: 'TotalPoints',
                width: 180
            }
        ];
        if (sprintStatus === this.sprintStates.FROZEN) {
            columnDefs = [
                ...commonColumns,
                {
                    headerName: 'Sprint Story Points',
                    field: 'SprintPoints',
                    width: 185
                },
                ...totalPointsColumn,
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
                ...commonColumns,
                {
                    headerName: 'Sprint Story Points',
                    field: 'SprintPoints',
                    editable: true,
                    width: 185,
                    valueParser: 'Number(newValue)',
                    cellEditor: 'numericEditor',
                    onCellValueChanged: (cellParams) => {
                        const valueChange = cellParams.newValue - cellParams.oldValue;
                        const newStoryPoints = this.totalTaskPoints + valueChange;
                        if (cellParams.newValue !== cellParams.oldValue) {
                            if (newStoryPoints > this.taskDetails.Estimate) {
                                this.snackBar.open(
                                    API_RESPONSE_MESSAGES.taskStoryPointsEstimatesError,
                                    '',
                                    {duration: SNACKBAR_DURATION}
                                );
                                this.revertCellValue(cellParams);
                            } else if (cellParams.newValue < 0) {
                                this.snackBar.open(
                                    API_RESPONSE_MESSAGES.taskStoryPointsNegativeError,
                                    '',
                                    {duration: SNACKBAR_DURATION}
                                );
                                this.revertCellValue(cellParams);
                            } else {
                                const memberDetails = cellParams.data;
                                this.updateSprintTaskMember(cellParams);
                            }
                        }
                    }
                },
                ...totalPointsColumn,
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
                            this.updateSprintTaskMember(cellParams);
                        }
                    }
                },
                {
                    headerName: 'Comments',
                    field: 'Comment',
                    width: 500,
                    filter: 'text',
                    tooltip: (params) => params.value,
                    cellEditor: 'agLargeTextCellEditor',
                    editable: true,
                    onCellValueChanged: (cellParams) => {
                        if (cellParams.newValue !== cellParams.oldValue) {
                            this.updateSprintTaskMember(cellParams);
                        }
                    }
                }
            ];
        }
        return columnDefs;
    }

    addNewSprintTaskMember() {
        if (this.selectedMemberID === undefined) {
            this.snackBar.open(API_RESPONSE_MESSAGES.memberNotSelectedError, '', {duration: SNACKBAR_DURATION});
        } else if (this.memberIDs.indexOf(this.selectedMemberID) !== -1) {
            this.snackBar.open(API_RESPONSE_MESSAGES.memberAlreadyPresent, '', {duration: SNACKBAR_DURATION});
        } else {
            this.retrospectiveService.addTaskMember(
                this.data.retrospectiveID, this.data.sprintID, this.taskDetails.ID, this.selectedMemberID
            ).subscribe(
                response => {
                    this.gridApi.updateRowData({ add: [response.data] });
                    this.memberIDs.push(this.selectedMemberID);
                },
                () => {
                    this.snackBar.open(API_RESPONSE_MESSAGES.addSprintTaskMemberError, '', {duration: SNACKBAR_DURATION});
                }
            );
        }
    }

    updateSprintTaskMember(params) {
        this.retrospectiveService.updateSprintTaskMember(this.data.retrospectiveID, this.data.sprintID, this.taskDetails.ID, params.data)
            .subscribe(
                response => {
                    const updatedMember = response.data;
                    if (params.colDef.field === 'SprintPoints') {
                        const valueChange = params.newValue - params.oldValue;
                        this.totalTaskPoints += valueChange;
                        updatedMember.TotalPoints += valueChange;
                    }
                    this.gridApi.updateRowData({update: [updatedMember]});
                    this.snackBar.open(API_RESPONSE_MESSAGES.memberUpdated, '', {duration: SNACKBAR_DURATION});
                },
                () => {
                    this.snackBar.open(API_RESPONSE_MESSAGES.updateSprintMemberError, '', {duration: SNACKBAR_DURATION});
                    this.revertCellValue(params);
                }
            );
    }

    revertCellValue(params) {
        const rowData = params.data;
        rowData[params.colDef.field] = params.oldValue;
        this.gridApi.updateRowData({update: [rowData]});
        this.gridApi.refreshCells();
    }
}
