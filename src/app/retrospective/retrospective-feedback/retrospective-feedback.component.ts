import { Component, EventEmitter, HostListener, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { DatePipe } from '@angular/common';

import { ColumnApi, GridApi, GridOptions } from 'ag-grid';
import * as _ from 'lodash';

import {
    API_RESPONSE_MESSAGES,
    RETRO_FEEDBACK_TYPES,
    SNACKBAR_DURATION,
    RETRO_FEEDBACK_SCOPE_LABELS,
    SPRINT_STATES,
    RETRO_FEEDBACK_GOAL_TYPES
} from '../../../constants/app-constants';
import { SelectCellEditorComponent } from '../../shared/ag-grid-editors/select-cell-editor/select-cell-editor.component';
import { DatePickerEditorComponent } from '../../shared/ag-grid-editors/date-picker-editor/date-picker-editor.component';
import {
    ClickableButtonRendererComponent
} from '../../shared/ag-grid-renderers/clickable-button-renderer/clickable-button-renderer.component';
import { RetrospectiveService } from '../../shared/services/retrospective.service';

@Component({
    selector: 'app-retrospective-feedback',
    templateUrl: './retrospective-feedback.component.html',
    styleUrls: ['./retrospective-feedback.component.scss']
})
export class RetrospectiveFeedbackComponent implements OnInit, OnChanges {
    goalTypes = RETRO_FEEDBACK_GOAL_TYPES;
    gridOptions: GridOptions;

    private columnDefs: any;
    private params: any;
    private gridApi: GridApi;
    private columnApi: ColumnApi;

    @Input() retrospectiveID;
    @Input() sprintID;
    @Input() sprintStatus;
    @Input() isTabActive;
    @Input() feedbackType: number;
    @Input() feedbackSubType;
    @Input() data: any;
    @Input() teamMembers: any;
    @Input() enableRefresh: boolean;

    @Output() resumeRefresh = new EventEmitter();
    @Output() pauseRefresh = new EventEmitter();

    @HostListener('window:resize') onResize() {
        if (this.gridApi) {
            this.resizeAgGrid();
        }
    }

    private resizeAgGrid() {
        setTimeout(() => {
            this.gridApi.sizeColumnsToFit();
        });
    }

    onCellEditingStarted() {
        this.pauseRefresh.emit();
    }

    onCellEditingStopped() {
        this.resumeRefresh.emit();
    }

    private createColumnDefs(sprintStatus, teamMembers) {
        let editable = true;
        if (sprintStatus === SPRINT_STATES.FROZEN || this.feedbackSubType === this.goalTypes.COMPLETED) {
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
                    valueFormatter: (cellParams) => this.getDateFromString(cellParams.value || ''),
                    onCellValueChanged: (cellParams) => {
                        if (!cellParams.newValue || cellParams.newValue !== cellParams.oldValue) {
                            this.updateRetroFeedback(cellParams);
                        }
                    }
                },
            ];

            const pendingGoalColumn = [
                {
                    headerName: 'Mark Resolved',
                    minWidth: 160,
                    cellRenderer: 'clickableButtonRenderer',
                    cellRendererParams: {
                        label: 'Mark Resolved',
                        onClick: this.resolveSprintGoal.bind(this)
                    },
                }
            ];
            const accomplishedGoalColumn = [
                {
                    headerName: 'Resolved At',
                    field: 'ResolvedAt',
                    minWidth: 160,
                    valueFormatter: (cellParams) => this.getDateFromString(cellParams.value || '')
                },
                {
                    headerName: 'Mark Unresolved',
                    minWidth: 160,
                    cellRenderer: 'clickableButtonRenderer',
                    cellRendererParams: {
                        label: 'Mark Unresolved',
                        onClick: this.unresolveSprintGoal.bind(this)
                    },
                }
            ];

            columnDefs = [...columnDefs, ...goalSpecificColumns];
            if (this.feedbackSubType === this.goalTypes.COMPLETED) {
                columnDefs = [...columnDefs, ...accomplishedGoalColumn];
            } else {
                columnDefs = [...columnDefs, ...pendingGoalColumn];
            }
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
                    this.resizeAgGrid();
                }
                if (changes.data) {
                    const data = changes.data.currentValue || [];
                    this.gridApi.setRowData(data.filter((feedback) => (this.feedbackType === RETRO_FEEDBACK_TYPES.GOAL) ||
                        feedback.SubType === this.feedbackSubType));
                    this.resizeAgGrid();
                }
                if (changes.isTabActive && changes.isTabActive.currentValue) {
                    this.resizeAgGrid();
                }
            });
        }
    }

    setGridOptions() {
        this.gridOptions = <GridOptions>{
            columnDefs: this.columnDefs,
            rowHeight: 60,
            singleClickEdit: true,
            frameworkComponents: {
                'selectEditor': SelectCellEditorComponent,
                'clickableButtonRenderer': ClickableButtonRendererComponent,
                'datePicker': DatePickerEditorComponent,
            }
        };
    }

    onGridReady(params) {
        this.params = params;
        this.gridApi = params.api;
        this.columnApi = params.columnApi;
        setTimeout(() => {
            if (this.data) {
                this.gridApi.setRowData(
                    this.data.filter((feedback) => this.feedbackType === RETRO_FEEDBACK_TYPES.GOAL
                        || feedback.SubType === this.feedbackSubType));
            }
            if (this.isTabActive) {
                this.gridApi.sizeColumnsToFit();
            }
        });
    }

    resolveSprintGoal(goalData: any) {
        this.retrospectiveService.resolveSprintGoal(this.retrospectiveID, this.sprintID, goalData.ID).subscribe(
            response => {
                this.gridApi.updateRowData({ remove: [goalData] });
                this.snackBar.open(API_RESPONSE_MESSAGES.goalResolvedSuccessfully, '', {duration: SNACKBAR_DURATION});
            },
            () => {
                this.snackBar.open(API_RESPONSE_MESSAGES.goalResolveFailed, '', {duration: SNACKBAR_DURATION});
            });
    }

    unresolveSprintGoal(goalData: any) {
        this.retrospectiveService.unresolveSprintGoal(this.retrospectiveID, this.sprintID, goalData.ID).subscribe(
            response => {
                this.gridApi.updateRowData({ remove: [goalData] });
                this.snackBar.open(API_RESPONSE_MESSAGES.goalUnResolvedSuccessfully, '', {duration: SNACKBAR_DURATION});
            },
            () => {
                this.snackBar.open(API_RESPONSE_MESSAGES.goalUnResolveFailed, '', {duration: SNACKBAR_DURATION});
            });
    }

    updateRetroFeedback(params: any) {
        if (this.feedbackType === RETRO_FEEDBACK_TYPES.HIGHLIGHT) {
            this.retrospectiveService.updateSprintHighlight(this.retrospectiveID, this.sprintID, params.data).subscribe(
                response => {
                    params.node.setData(response.data);
                    this.snackBar.open(API_RESPONSE_MESSAGES.sprintHighlightsUpdateSuccess, '', {duration: SNACKBAR_DURATION});
                },
                () => {
                    this.snackBar.open(API_RESPONSE_MESSAGES.sprintHighlightsUpdateError, '', {duration: SNACKBAR_DURATION});
                    this.revertCellValue(params);
                }
            );
        } else if (this.feedbackType === RETRO_FEEDBACK_TYPES.NOTE) {
            this.retrospectiveService.updateRetroNote(this.retrospectiveID, this.sprintID, params.data).subscribe(
                response => {
                    params.node.setData(response.data);
                    this.snackBar.open(API_RESPONSE_MESSAGES.sprintNotesUpdateSuccess, '', {duration: SNACKBAR_DURATION});
                },
                () => {
                    this.snackBar.open(API_RESPONSE_MESSAGES.sprintNotesUpdateError, '', {duration: SNACKBAR_DURATION});
                    this.revertCellValue(params);
                });
        } else if (this.feedbackType === RETRO_FEEDBACK_TYPES.GOAL) {
            this.retrospectiveService.updateRetroGoal(this.retrospectiveID, this.sprintID, params.data).subscribe(
                response => {
                    params.node.setData(response.data);
                    this.snackBar.open(API_RESPONSE_MESSAGES.sprintGoalsUpdateSuccess, '', {duration: SNACKBAR_DURATION});
                },
                () => {
                    this.snackBar.open(API_RESPONSE_MESSAGES.sprintGoalsUpdateError, '', {duration: SNACKBAR_DURATION});
                    this.revertCellValue(params);
                });
        }
    }

    addMoreRow() {
        if (this.gridApi) {
            if (this.feedbackType === RETRO_FEEDBACK_TYPES.HIGHLIGHT) {
                this.retrospectiveService.addSprintHighlight(this.retrospectiveID, this.sprintID, this.feedbackSubType)
                    .subscribe(
                        response => {
                            this.gridApi.updateRowData({ add: [response.data], addIndex: 0 });
                            this.snackBar.open(API_RESPONSE_MESSAGES.sprintHighlightsAddSuccess, '', {duration: SNACKBAR_DURATION});
                        },
                        () => {
                            this.snackBar.open(API_RESPONSE_MESSAGES.sprintHighlightsAddError, '', {duration: SNACKBAR_DURATION});
                        }
                    );
            } else if (this.feedbackType === RETRO_FEEDBACK_TYPES.NOTE) {
                this.retrospectiveService.addNewRetroNote(this.retrospectiveID, this.sprintID, this.feedbackSubType)
                    .subscribe(
                        response => {
                            this.gridApi.updateRowData({ add: [response.data], addIndex: 0 });
                            this.snackBar.open(API_RESPONSE_MESSAGES.sprintNotesAddSuccess, '', {duration: SNACKBAR_DURATION});
                        },
                        () => {
                            this.snackBar.open(API_RESPONSE_MESSAGES.sprintNotesAddError, '', {duration: SNACKBAR_DURATION});
                        }
                    );
            } else if (this.feedbackType === RETRO_FEEDBACK_TYPES.GOAL) {
                this.retrospectiveService.addNewRetroGoal(this.retrospectiveID, this.sprintID)
                    .subscribe(
                        response => {
                            this.gridApi.updateRowData({ add: [response.data], addIndex: 0 });
                            this.snackBar.open(API_RESPONSE_MESSAGES.sprintGoalsAddSuccess, '', {duration: SNACKBAR_DURATION});
                        },
                        () => {
                            this.snackBar.open(API_RESPONSE_MESSAGES.sprintGoalsAddError, '', {duration: SNACKBAR_DURATION});
                        }
                    );
            }
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

    getDateFromString(dateString: string) {
        return this.datePipe.transform(dateString, 'MMMM dd, yyyy');
    }
}
