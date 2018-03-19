import {Component, HostListener, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import { ColumnApi, GridApi, GridOptions } from 'ag-grid';
import {
    API_RESPONSE_MESSAGES,
    RETRO_FEEDBACK_TYPES,
    SNACKBAR_DURATION,
    RETRO_FEEDBACK_SCOPE_LABELS,
    SPRINT_STATES
} from '../../../constants/app-constants';
import {RetrospectiveService} from '../../shared/services/retrospective.service';
import {MatSnackBar} from '@angular/material';
import {DatePipe} from '@angular/common';
import * as _ from 'lodash';
import {SelectCellEditorComponent} from '../../shared/ag-grid-editors/select-cell-editor/select-cell-editor.component';
import {DatePickerEditorComponent} from "../../shared/ag-grid-editors/date-picker-editor/date-picker-editor.component";

@Component({
  selector: 'app-retrospective-feedback',
  templateUrl: './retrospective-feedback.component.html',
  styleUrls: ['./retrospective-feedback.component.scss']
})
export class RetrospectiveFeedbackComponent implements OnInit, OnChanges {

    gridOptions: GridOptions;

    private columnDefs: any;
    private params: any;
    private gridApi: GridApi;
    private columnApi: ColumnApi;

    @Input() retrospectiveID;
    @Input() sprintID;
    @Input() sprintStatus;
    @Input() feedbackType: number;
    @Input() feedbackSubType: number;
    @Input() data: any;
    @Input() teamMembers: any;

    @HostListener('window:resize') onResize() {
        if (this.gridApi) {
            setTimeout(() => {
                this.gridApi.sizeColumnsToFit();
            });
        }
    }

    private createColumnDefs(sprintStatus, teamMembers) {
        let editable = true;
        if (sprintStatus === SPRINT_STATES.FROZEN) {
            editable = false;
        }

        let columnDefs;
        columnDefs = [
            {
                headerName: 'Text',
                field: 'Text',
                minWidth: 160,
                editable: editable,
                onCellValueChanged: (cellParams) => {
                    if (cellParams.newValue !== cellParams.oldValue) {
                        this.updateRetroFeedback(cellParams);
                    }
                }
            },
            {
                headerName: 'Scope',
                field: 'Scope',
                minWidth: 160,
                editable: editable,
                valueFormatter: (cellParams) => RETRO_FEEDBACK_SCOPE_LABELS[cellParams.value],
                cellEditor: 'selectEditor',
                cellEditorParams: {
                    selectOptions: _.map(RETRO_FEEDBACK_SCOPE_LABELS, (value, key) => {
                        return {
                            id: _.parseInt(key),
                            value: value
                        };
                    }),
                },
                onCellValueChanged: (cellParams) => {
                    if (cellParams.newValue !== cellParams.oldValue) {
                        this.updateRetroFeedback(cellParams);
                    }
                }
            },
            {
                headerName: 'Assignee',
                field: 'AssigneeID',
                minWidth: 160,
                editable: editable,
                valueFormatter: (cellParams) => {
                    const assignee = cellParams.data.Assignee;
                    if (_.isEmpty(assignee)) {
                        return '-';
                    }
                    return (assignee.FirstName + ' ' + assignee.LastName).trim();
                },
                cellEditor: 'selectEditor',
                cellEditorParams: {
                    selectOptions: this.getTeamMemberOptions(teamMembers),
                },
                onCellValueChanged: (cellParams) => {
                    if (!cellParams.newValue || cellParams.newValue !== cellParams.oldValue) {
                        this.updateRetroFeedback(cellParams);
                    }
                }
            },
            {
                headerName: 'Added At',
                field: 'AddedAt',
                minWidth: 160,
                valueFormatter: (cellParams) => this.getDateFromString(cellParams.value || '')
            },
            {
                headerName: 'Created By',
                field: 'CreatedBy',
                minWidth: 160,
                valueFormatter: (cellParams) => cellParams.value && (cellParams.value.FirstName + ' ' + cellParams.value.LastName).trim()
            },
        ];

        if (this.feedbackType === RETRO_FEEDBACK_TYPES.GOAL) {
            const goalSpecificColumns = [
                {
                    headerName: 'Expected At',
                    field: 'ExpectedAt',
                    minWidth: 160,
                    editable: editable,
                    cellEditor: 'datePicker',
                    valueFormatter: (cellParams) => this.getDateFromString(cellParams.value || '')
                },
                {
                    headerName: 'Resolved At',
                    field: 'ResolvedAt',
                    minWidth: 160,
                    valueFormatter: (cellParams) => this.getDateFromString(cellParams.value || '')
                },
                {
                    headerName: 'Mark Resolved',
                    minWidth: 160,
                },
            ];
            columnDefs = [...columnDefs, ...goalSpecificColumns];
        }
        return columnDefs;
    }

    constructor(private retrospectiveService: RetrospectiveService,
                private snackBar: MatSnackBar,
                private datePipe: DatePipe) { }

    ngOnInit() {
        this.columnDefs = this.createColumnDefs(this.sprintStatus, this.teamMembers);
        this.setGridOptions();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (this.gridApi) {
            setTimeout(() => {
                if (changes.sprintStatus || changes.teamMembers) {
                    this.teamMembers = (changes.teamMembers && changes.teamMembers.currentValue)
                        || this.teamMembers;

                    this.sprintStatus = (changes.sprintStatus && changes.sprintStatus.currentValue)
                        || this.sprintStatus;

                    this.columnDefs = this.createColumnDefs(this.sprintStatus, this.teamMembers);
                    this.gridApi.setColumnDefs(this.columnDefs);
                }
                if (changes.data) {
                    const data = changes.data.currentValue || [];
                    this.gridApi.setRowData(data.filter((note) => (this.feedbackType === RETRO_FEEDBACK_TYPES.GOAL) ||
                        note.SubType === this.feedbackSubType));
                }
                this.gridApi.sizeColumnsToFit();
            });
        }
    }

    setGridOptions() {
        this.gridOptions = <GridOptions>{
            columnDefs: this.columnDefs,
            defaultColDef: {
                width: 150,
            },
            rowHeight: 60,
            singleClickEdit: true,
            frameworkComponents: {
                'selectEditor': SelectCellEditorComponent,
                'datePicker': DatePickerEditorComponent
            }
        };
    }

    onGridReady(params) {
        this.params = params;
        this.gridApi = params.api;
        this.columnApi = params.columnApi;
    }

    getDateFromString(dateString: string) {
        return this.datePipe.transform(dateString, 'MMMM dd, yyyy');
    }

    addMoreRow() {
        if (this.gridApi) {
            if (this.feedbackType === RETRO_FEEDBACK_TYPES.NOTE) {
                this.retrospectiveService.addNewRetroNote(this.retrospectiveID, this.sprintID, this.feedbackSubType)
                    .subscribe(
                        response => {
                            this.gridApi.updateRowData({ add: [response.data] });
                        },
                        () => {
                            this.snackBar.open(API_RESPONSE_MESSAGES.error, '', {duration: SNACKBAR_DURATION});
                        }
                    );
            } else if (this.feedbackType === RETRO_FEEDBACK_TYPES.GOAL) {
                this.retrospectiveService.addNewRetroGoal(this.retrospectiveID, this.sprintID)
                    .subscribe(
                        response => {
                            this.gridApi.updateRowData({ add: [response.data] });
                        },
                        () => {
                            this.snackBar.open(API_RESPONSE_MESSAGES.error, '', {duration: SNACKBAR_DURATION});
                        }
                    );
            }
        }
    }

    updateRetroFeedback(params: any) {
        if (this.feedbackType === RETRO_FEEDBACK_TYPES.NOTE) {
            this.retrospectiveService.updateRetroNote(this.retrospectiveID, this.sprintID, params.data).subscribe(
                response => {
                    params.node.setData(response.data);
                    this.snackBar.open('updated', '', {duration: SNACKBAR_DURATION});
                },
                () => {
                    this.snackBar.open(API_RESPONSE_MESSAGES.error, '', {duration: SNACKBAR_DURATION});
                    this.revertCellValue(params);
                });
        } else if (this.feedbackType === RETRO_FEEDBACK_TYPES.GOAL) {
            this.retrospectiveService.updateRetroGoal(this.retrospectiveID, this.sprintID, params.data).subscribe(
                response => {
                    params.node.setData(response.data);
                    this.snackBar.open('updated', '', {duration: SNACKBAR_DURATION});
                },
                () => {
                    this.snackBar.open(API_RESPONSE_MESSAGES.error, '', {duration: SNACKBAR_DURATION});
                    this.revertCellValue(params);
                });
        }
    }

    getTeamMemberOptions(teamMembers) {
        teamMembers = _.map(teamMembers, (value: any, key) => {
            return {
                id: _.parseInt(value.ID),
                value: (value.FirstName + ' ' + value.LastName).trim(),
            };
        });
        return [{id: null, value: 'None'}, ...teamMembers];
    }

    revertCellValue(params) {
        const rowData = params.data;
        rowData[params.colDef.field] = params.oldValue;
        this.gridApi.updateRowData({update: [rowData]});
    }
}
