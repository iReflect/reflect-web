import { Component, Inject, OnInit } from '@angular/core';
import { API_RESPONSE_MESSAGES, SNACKBAR_DURATION } from '../../../constants/app-constants';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { RetrospectiveService } from '../../shared/services/retrospective.service';
import { RetrospectiveCreateComponent } from '../retrospective-create/retrospective-create.component';
import { GridOptions } from 'ag-grid';
import { RatingRendererComponent } from '../../shared/ag-grid-renderers/rating-renderer/rating-renderer.component';
import { RatingEditorComponent } from '../../shared/ag-grid-editors/rating-editor/rating-editor.component';

@Component({
    selector: 'app-retrospect-task-modal',
    templateUrl: './retrospect-task-modal.component.html',
    styleUrls: ['./retrospect-task-modal.component.scss']
})
export class RetrospectTaskModalComponent implements OnInit {
    memberIDs: any[] = [];
    sprintMembers: any[];
    selectedMemberID: number;
    gridOptions: GridOptions;

    private totalTaskStoryPoints = 0;
    private params: any;
    private rowData: any[];
    private columnDefs: any;
    private gridApi: any;
    private columnApi: any;

    constructor(private retrospectiveService: RetrospectiveService,
                private snackBar: MatSnackBar,
                public dialogRef: MatDialogRef<RetrospectiveCreateComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any) {

        this.retrospectiveService.getSprintMembers(data.sprintID).subscribe(
            response => {
                this.sprintMembers = response.members;
            },
            () => {
                this.snackBar.open(API_RESPONSE_MESSAGES.getSprintMembersError, '', {duration: SNACKBAR_DURATION});
            }
        );

        this.columnDefs = this.createColumnDefs();
        this.gridOptions = <GridOptions>{
            rowData: this.rowData,
            columnDefs: this.columnDefs,
            rowHeight: 48,
            frameworkComponents: {
                'ratingEditor': RatingEditorComponent,
                'ratingRenderer': RatingRendererComponent
            }
        };
    }

    ngOnInit() { }

    onGridReady(params) {
        this.params = params;
        this.gridApi = params.api;
        this.columnApi = params.columnApi;
        this.createRowData();
    }

    createRowData() {
        this.retrospectiveService.getTaskMemberDetails(this.data.task.ID)
            .subscribe(
                data => {
                    this.rowData = data['Members'];
                    this.gridApi.setRowData(this.rowData);
                    data['Members'].map(member => {
                        this.memberIDs.push(member['ID']);
                        this.totalTaskStoryPoints += member['Total Story Points'];
                        return member;
                    });
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
                width: 110,
                pinned: true
            },
            {
                headerName: 'Sprint Hours',
                field: 'Total Sprint Hours',
                width: 150
            },
            {
                headerName: 'Total Time',
                field: 'Total Time Spent',
                width: 140
            },
            {
                headerName: 'Sprint Story Points',
                field: 'Sprint Story Points',
                editable: true,
                width: 185,
                valueParser: 'Number(newValue)',
                // TODO: set cell renderer to numeric cell renderer
                onCellValueChanged: (cellParams) => {
                    const newStoryPoints = this.totalTaskStoryPoints + cellParams.newValue - cellParams.oldValue;
                    if (cellParams.newValue !== cellParams.oldValue) {
                        if (cellParams.newValue >= 0 && newStoryPoints <= this.data.task['Estimates']) {
                            const memberDetails = cellParams.data;
                            memberDetails['Total Story Points'] += cellParams.newValue - cellParams.oldValue;
                            this.totalTaskStoryPoints += cellParams.newValue - cellParams.oldValue;
                            this.updateMemberDetails(cellParams, memberDetails);
                            this.gridApi.setRowData(this.rowData);
                        } else {
                            if (newStoryPoints > this.data.task['Estimates']) {
                                this.snackBar.open(API_RESPONSE_MESSAGES.taskStoryPointsEstimatesError, '', {duration: SNACKBAR_DURATION});
                            } else if (cellParams.newValue < 0) {
                                this.snackBar.open(API_RESPONSE_MESSAGES.taskStoryPointsNegativeError, '', {duration: SNACKBAR_DURATION});
                            }
                            this.revertCellValue(cellParams);
                        }
                    }
                }
            },
            {
                headerName: 'Total Story Points',
                field: 'Total Story Points',
                width: 180
            },
            {
                headerName: 'Comments',
                field: 'Comments',
                width: 500,
                filter: 'text',
                tooltip: (params) => params.value,
                cellEditor: 'agLargeTextCellEditor',
                editable: true,
                onCellValueChanged: (cellParams) => {
                    if (cellParams.newValue !== cellParams.oldValue) {
                        this.updateMemberDetails(cellParams, cellParams.data);
                        this.gridApi.setRowData(this.rowData);
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
                        this.updateMemberDetails(cellParams, cellParams.data);
                        this.gridApi.setRowData(this.rowData);
                    }
                }
            }
        ];
        return columnDefs;
    }

    addNewMember() {
        if (this.selectedMemberID === undefined) {
            this.snackBar.open(API_RESPONSE_MESSAGES.memberNotSelectedError, '', {duration: SNACKBAR_DURATION});
        } else if (this.memberIDs.indexOf(this.selectedMemberID) !== -1) {
            this.snackBar.open(API_RESPONSE_MESSAGES.memberAlreadyPresent, '', {duration: SNACKBAR_DURATION});
        } else {
            this.retrospectiveService.getNewTaskMemberDetails(this.selectedMemberID, this.data.task['Task ID'])
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

    updateMemberDetails(params, memberDetails) {
        this.retrospectiveService.updateTaskMember(memberDetails).subscribe(
            () => { },
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
