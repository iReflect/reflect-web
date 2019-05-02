import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { MatSnackBar } from '@angular/material';

import {
    API_RESPONSE_MESSAGES,
    RETRO_FEEDBACK_GOAL_TYPES,
    RETRO_FEEDBACK_TYPES,
    AUTO_REFRESH_DURATION,
    SNACKBAR_DURATION,
    SPRINT_NOTES_SECTIONS_LIST
} from '@constants/app-constants';
import { RetrospectiveService } from 'app/shared/services/retrospective.service';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/finally';
import { UtilsService } from 'app/shared/utils/utils.service';
import { forkJoin } from 'rxjs/observable/forkJoin';

@Component({
    selector: 'app-sprint-notes',
    templateUrl: './sprint-notes.component.html',
    styleUrls: ['./sprint-notes.component.scss']
})
export class SprintNotesComponent implements OnInit, OnChanges, OnDestroy {
    @Input() enableRefresh: boolean;
    @Input() retrospectiveID;
    @Input() sprintID;
    @Input() sprintStatus;
    @Input() sprintEndDate;
    @Input() isTabActive: boolean;
    @Input() refreshOnChange: boolean;

    @Output() onRefreshStart = new EventEmitter<boolean>();
    @Output() onRefreshEnd = new EventEmitter<boolean>();

    notesSectionsList = SPRINT_NOTES_SECTIONS_LIST;
    retroFeedbackTypes = RETRO_FEEDBACK_TYPES;
    goalTypes = RETRO_FEEDBACK_GOAL_TYPES;
    sprintGoals: any;
    sprintNotes: any;
    teamMembers: any;
    autoRefreshCurrentState = true;
    private destroy$: Subject<boolean> = new Subject<boolean>();

    constructor(
        private retrospectiveService: RetrospectiveService,
        private snackBar: MatSnackBar,
        private utils: UtilsService
    ) {
    }

    ngOnInit() {
        Observable.interval(AUTO_REFRESH_DURATION)
            .takeUntil(this.destroy$)
            .subscribe(() => {
                if (this.autoRefreshCurrentState && this.isTabActive) {
                    this.getSprintNotesTab(true, true);
                }
            });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.isTabActive && changes.isTabActive.currentValue) {
            this.getSprintNotesTab();
        }
        if (changes.enableRefresh) {
            this.autoRefreshCurrentState = changes.enableRefresh.currentValue;
            if (this.isTabActive && !changes.isTabActive && this.autoRefreshCurrentState) {
                this.getSprintNotesTab(true, true);
            }
        }
        if (this.isTabActive && !changes.isTabActive && changes.refreshOnChange) {
            this.getSprintNotesTab(true);
        }
    }

    ngOnDestroy() {
        this.autoRefreshCurrentState = false;
        this.destroy$.next(true);
        this.destroy$.complete();
    }

    getSprintNotesTab(isRefresh = false, isAutoRefresh = false) {
        if (!isAutoRefresh) {
            this.onRefreshStart.emit(true);
        }
        const notesArray$ = [];
        notesArray$.push(this.getTeamMembers(isRefresh, isAutoRefresh));
        notesArray$.push(this.getSprintGoals(isRefresh, isAutoRefresh));
        notesArray$.push(this.getSprintNotes(isRefresh, isAutoRefresh));
        forkJoin(...notesArray$)
            .finally(() => {
                if (!isAutoRefresh) {
                    this.onRefreshEnd.emit(true);
                }
            })
            .subscribe();
    }

    pauseRefresh() {
        this.autoRefreshCurrentState = false;
    }

    resumeRefresh() {
        this.autoRefreshCurrentState = this.enableRefresh;
    }

    getSprintGoals(isRefresh = false, isAutoRefresh = false) {
        return this.retrospectiveService.getSprintGoals(this.retrospectiveID, this.sprintID, 'added', isAutoRefresh)
            .takeUntil(this.destroy$)
            .do(
                response => {
                    this.sprintGoals = response.data.Feedbacks;
                },
                err => {
                    if (isRefresh) {
                        this.snackBar.open(
                            API_RESPONSE_MESSAGES.sprintNotesTabRefreshFailure,
                            '', {duration: SNACKBAR_DURATION});
                    } else {
                        this.snackBar.open(this.utils.getApiErrorMessage(err) || API_RESPONSE_MESSAGES.someThingWentWrong,
                            '', {duration: SNACKBAR_DURATION});
                    }
                }
            );
    }

    getSprintNotes(isRefresh = false, isAutoRefresh = false) {
        return this.retrospectiveService.getSprintNotes(this.retrospectiveID, this.sprintID, isAutoRefresh)
            .takeUntil(this.destroy$)
            .do(
                response => {
                    this.sprintNotes = response.data.Feedbacks;
                },
                err => {
                    if (isRefresh) {
                        this.snackBar.open(
                            API_RESPONSE_MESSAGES.sprintNotesTabRefreshFailure,
                            '', {duration: SNACKBAR_DURATION});
                    } else {
                        this.snackBar.open(this.utils.getApiErrorMessage(err) || API_RESPONSE_MESSAGES.someThingWentWrong,
                            '', {duration: SNACKBAR_DURATION});
                    }
                }
            );
    }

    getTeamMembers(isRefresh = false, isAutoRefresh = false) {
        return this.retrospectiveService.getRetroMembers(this.retrospectiveID, isAutoRefresh)
            .takeUntil(this.destroy$)
            .do(
                response => {
                    this.teamMembers = response.data.Members;
                },
                err => {
                    if (isRefresh) {
                        this.snackBar.open(
                            API_RESPONSE_MESSAGES.sprintNotesTabRefreshFailure,
                            '', {duration: SNACKBAR_DURATION});
                    } else {
                        this.snackBar.open(this.utils.getApiErrorMessage(err) || API_RESPONSE_MESSAGES.someThingWentWrong,
                            '', {duration: SNACKBAR_DURATION});
                    }
                }
            );
    }
}
