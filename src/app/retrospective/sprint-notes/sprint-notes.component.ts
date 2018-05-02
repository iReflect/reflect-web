import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { MatSnackBar } from '@angular/material';

import {
    API_RESPONSE_MESSAGES,
    RETRO_FEEDBACK_GOAL_TYPES,
    RETRO_FEEDBACK_TYPES,
    AUTO_REFRESH_DURATION,
    SNACKBAR_DURATION,
    SPRINT_NOTES_SECTIONS_LIST
} from '../../../constants/app-constants';
import { RetrospectiveService } from '../../shared/services/retrospective.service';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/observable/interval';
import { UtilsService } from '../../shared/utils/utils.service';
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
                    this.getSprintNotesTab();
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
                this.getSprintNotesTab();
            }
        }
        if (this.isTabActive && !changes.isTabActive && changes.refreshOnChange) {
            this.getSprintNotesTab(true, true);
        }
    }

    ngOnDestroy() {
        this.autoRefreshCurrentState = false;
        this.destroy$.next(true);
        this.destroy$.complete();
    }

    getSprintNotesTab(isRefresh = true, isManualRefresh = false) {
        if (isManualRefresh) {
            this.onRefreshStart.emit(true);
        }
        const notesArray$ = [];
        notesArray$.push(this.getTeamMembers(isRefresh));
        notesArray$.push(this.getSprintGoals(isRefresh));
        notesArray$.push(this.getSprintNotes(isRefresh));
        forkJoin(...notesArray$).subscribe(() => {}, () => {}, () => {
            if (isManualRefresh) {
                this.onRefreshEnd.emit(true);
            }
        });
    }

    pauseRefresh() {
        this.autoRefreshCurrentState = false;
    }

    resumeRefresh() {
        this.autoRefreshCurrentState = this.enableRefresh;
    }

    getSprintGoals(isRefresh = false) {
        const getSprintGoals$ = this.retrospectiveService.getSprintGoals(this.retrospectiveID, this.sprintID, 'added')
            .takeUntil(this.destroy$);
        getSprintGoals$.subscribe(
            response => {
                this.sprintGoals = response.data.Feedbacks;
            },
            err => {
                if (isRefresh) {
                    this.snackBar.open(
                        API_RESPONSE_MESSAGES.sprintNotesTabRefreshFailure,
                        '', {duration: SNACKBAR_DURATION});
                } else {
                    this.snackBar.open(this.utils.getApiErrorMessage(err) || API_RESPONSE_MESSAGES.sprintAddedGoalsGetError,
                        '', {duration: SNACKBAR_DURATION});
                }
            }
        );
        return getSprintGoals$;
    }

    getSprintNotes(isRefresh = false) {
        const getSprintNotes$ = this.retrospectiveService.getSprintNotes(this.retrospectiveID, this.sprintID)
            .takeUntil(this.destroy$);
        getSprintNotes$.subscribe(
            response => {
                this.sprintNotes = response.data.Feedbacks;
            },
            err => {
                if (isRefresh) {
                    this.snackBar.open(
                        API_RESPONSE_MESSAGES.sprintNotesTabRefreshFailure,
                        '', {duration: SNACKBAR_DURATION});
                } else {
                    this.snackBar.open(this.utils.getApiErrorMessage(err) || API_RESPONSE_MESSAGES.sprintNotesGetError,
                        '', {duration: SNACKBAR_DURATION});
                }
            }
        );
        return getSprintNotes$;
    }

    getTeamMembers(isRefresh = false) {
        const getTeamMember$ = this.retrospectiveService.getRetroMembers(this.retrospectiveID)
            .takeUntil(this.destroy$);
        getTeamMember$.subscribe(
            response => {
                this.teamMembers = response.data.Members;
            },
            err => {
                if (isRefresh) {
                    this.snackBar.open(
                        API_RESPONSE_MESSAGES.sprintNotesTabRefreshFailure,
                        '', {duration: SNACKBAR_DURATION});
                } else {
                    this.snackBar.open(this.utils.getApiErrorMessage(err) || API_RESPONSE_MESSAGES.getRetrospectiveMembersError,
                        '', {duration: SNACKBAR_DURATION});
                }
            }
        );
        return getTeamMember$;
    }
}
