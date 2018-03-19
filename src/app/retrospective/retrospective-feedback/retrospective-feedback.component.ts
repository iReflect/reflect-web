import { Component, HostListener, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ColumnApi, GridApi, GridOptions } from 'ag-grid';
import {
    API_RESPONSE_MESSAGES, RETRO_FEEDBACK_TYPES, SNACKBAR_DURATION,
    RETRO_FEEDBACK_SCOPE_LABELS, SPRINT_STATES, RETRO_FEEDBACK_GOAL_TYPES
} from '../../../constants/app-constants';
import { RetrospectiveService } from '../../shared/services/retrospective.service';
import { MatSnackBar } from '@angular/material';
import { DatePipe } from '@angular/common';
import * as _ from 'lodash';
import { SelectCellEditorComponent } from '../../shared/ag-grid-editors/select-cell-editor/select-cell-editor.component';
import {
    ClickableButtonRendererComponent
} from '../../shared/ag-grid-renderers/clickable-button-renderer/clickable-button-renderer.component';

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

    @HostListener('window:resize') onResize() {
        if (this.gridApi) {
            setTimeout(() => {
                this.gridApi.sizeColumnsToFit();
            });
        }
    }

    private createColumnDefs(sprintStatus) {
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
                valueFormatter: (cellParams) => RETRO_FEEDBACK_SCOPE_LABELS[cellParams.value]
            },
            {
                headerName: 'Assignee',
                field: 'Assignee',
                minWidth: 160,
                editable: editable,
                valueFormatter: (cellParams) => cellParams.value && (cellParams.value.FirstName + ' ' + cellParams.value.LastName).trim(),
                cellEditor: 'selectEditor',
                cellEditorParams: {
                    selectOptions: _.map(this.teamMembers, (value: any, key) => {
                        return {
                            id: _.parseInt(value.ID),
                            value: (value.FirstName + ' ' + value.LastName).trim(),
                        };
                    }),
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
                    valueFormatter: (cellParams) => this.getDateFromString(cellParams.value || '')
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
        this.columnDefs = this.createColumnDefs(this.sprintStatus);
        this.setGridOptions();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (this.gridApi) {
            setTimeout(() => {
                if (changes.sprintStatus) {
                    this.columnDefs = this.createColumnDefs(changes.sprintStatus.currentValue);
                    this.gridApi.setColumnDefs(this.columnDefs);
                }
                if (changes.data) {
                    const data = changes.data.currentValue || [];
                    this.gridApi.setRowData(this.data.filter((item) => this.feedbackType === RETRO_FEEDBACK_TYPES.GOAL || item.SubType === this.feedbackSubType));
                }
                if (changes.isTabActive && changes.isTabActive.currentValue) {
                    this.gridApi.sizeColumnsToFit();
                }
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
                'clickableButtonRenderer': ClickableButtonRendererComponent
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
                    this.data.filter((item) => this.feedbackType === RETRO_FEEDBACK_TYPES.GOAL || item.SubType === this.feedbackSubType));
            }
            if (this.isTabActive) {
                this.gridApi.sizeColumnsToFit();
            }
        });
    }

    getDateFromString(dateString: string) {
        return this.datePipe.transform(dateString, 'MMMM dd, yyyy');
    }

    addMoreRow() {
        if (this.gridApi) {
            if (this.feedbackType === RETRO_FEEDBACK_TYPES.HIGHLIGHT) {
                this.retrospectiveService.addSprintHighlight(this.retrospectiveID, this.sprintID, this.feedbackSubType)
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

    resolveSprintGoal(params: any) {
        this.retrospectiveService.resolveSprintGoal(this.retrospectiveID, this.sprintID, params.ID).subscribe(
            response => {
                this.snackBar.open('goal resolved', '', {duration: SNACKBAR_DURATION});
            },
            () => {
                this.snackBar.open(API_RESPONSE_MESSAGES.error, '', {duration: SNACKBAR_DURATION});
                this.revertCellValue(params);
            });
    }

    unresolveSprintGoal(params: any) {
        this.retrospectiveService.unresolveSprintGoal(this.retrospectiveID, this.sprintID, params.ID).subscribe(
            response => {
                this.snackBar.open('goal unresolved', '', {duration: SNACKBAR_DURATION});
            },
            () => {
                this.snackBar.open(API_RESPONSE_MESSAGES.error, '', {duration: SNACKBAR_DURATION});
                this.revertCellValue(params);
            });
    }

    updateRetroFeedback(params: any) {
        if (this.feedbackType === RETRO_FEEDBACK_TYPES.HIGHLIGHT) {
            this.retrospectiveService.updateSprintHighlight(this.retrospectiveID, this.sprintID, params.data).subscribe(
                response => {
                    params.node.setData(response.data);
                    this.snackBar.open(API_RESPONSE_MESSAGES.error, '', {duration: SNACKBAR_DURATION});
                },
                () => {
                    this.snackBar.open(API_RESPONSE_MESSAGES.error, '', {duration: SNACKBAR_DURATION});
                    this.revertCellValue(params);
                });
        }
    }

    revertCellValue(params) {
        const rowData = params.data;
        rowData[params.colDef.field] = params.oldValue;
        this.gridApi.updateRowData({update: [rowData]});
    }
}
