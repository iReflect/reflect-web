import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { MatSnackBar } from '@angular/material';

import {
    API_RESPONSE_MESSAGES,
    AUTO_REFRESH_DURATION,
    HIGHLIGHTS_LIST,
    RETRO_FEEDBACK_GOAL_TYPES,
    RETRO_FEEDBACK_TYPES,
    SNACKBAR_DURATION
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
    selector: 'app-sprint-highlights',
    templateUrl: './sprint-highlights.component.html',
    styleUrls: ['./sprint-highlights.component.scss']
})
export class SprintHighlightsComponent implements OnInit, OnChanges, OnDestroy {
    highlightsList = HIGHLIGHTS_LIST;
    retroFeedbackTypes = RETRO_FEEDBACK_TYPES;
    goalTypes = RETRO_FEEDBACK_GOAL_TYPES;
    pendingGoals: any;
    accomplishedGoals: any;
    sprintHighlights: any;
    teamMembers: any;
    autoRefreshCurrentState = true;
    private destroy$: Subject<boolean> = new Subject<boolean>();

    @Input() enableRefresh: boolean;
    @Input() retrospectiveID;
    @Input() sprintID;
    @Input() sprintStatus;
    @Input() sprintEndDate;
    @Input() isTabActive: boolean;
    @Input() refreshOnChange: boolean;

    @Output() onRefreshStart = new EventEmitter<boolean>();
    @Output() onRefreshEnd = new EventEmitter<boolean>();

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
                    this.getSprintHighlightsTab(true, true);
                }
            });
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.isTabActive && changes.isTabActive.currentValue) {
            this.getSprintHighlightsTab();
        }
        if (changes.enableRefresh) {
            this.autoRefreshCurrentState = changes.enableRefresh.currentValue;
            if (this.isTabActive && !changes.isTabActive && this.autoRefreshCurrentState) {
                this.getSprintHighlightsTab(true, true);
            }
        }
        if (this.isTabActive && !changes.isTabActive && changes.refreshOnChange) {
            this.getSprintHighlightsTab(true);
        }
    }

    ngOnDestroy() {
        this.autoRefreshCurrentState = false;
        this.destroy$.next(true);
        this.destroy$.complete();
    }

    getSprintHighlightsTab(isRefresh = false, isAutoRefresh = false) {
        if (!isAutoRefresh) {
            this.onRefreshStart.emit(true);
        }
        const highlightsArray$ = [];
        highlightsArray$.push(this.getTeamMembers(isRefresh, isAutoRefresh));
        highlightsArray$.push(this.getSprintHighlights(isRefresh, isAutoRefresh));
        highlightsArray$.push(this.getPendingGoals(isRefresh, isAutoRefresh));
        highlightsArray$.push(this.getAccomplishedGoals(isRefresh, isAutoRefresh));
        forkJoin(...highlightsArray$)
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

    getPendingGoals(isRefresh = false, isAutoRefresh = false) {
        return this.retrospectiveService.getSprintGoals(this.retrospectiveID, this.sprintID, 'pending', isAutoRefresh)
            .takeUntil(this.destroy$)
            .do(
                response => {
                    this.pendingGoals = response.data.Feedbacks;
                },
                err => {
                    if (isRefresh) {
                        this.snackBar.open(
                            API_RESPONSE_MESSAGES.sprintHighlightsTabRefreshFailure,
                            '', {duration: SNACKBAR_DURATION});
                    } else {
                        this.snackBar.open(this.utils.getApiErrorMessage(err) || API_RESPONSE_MESSAGES.someThingWentWrong,
                            '', {duration: SNACKBAR_DURATION});
                    }
                }
            );
    }

    getAccomplishedGoals(isRefresh = false, isAutoRefresh = false) {
        return this.retrospectiveService.getSprintGoals(this.retrospectiveID, this.sprintID, 'completed', isAutoRefresh)
            .takeUntil(this.destroy$)
            .do(
                response => {
                    this.accomplishedGoals = response.data.Feedbacks;
                },
                err => {
                    if (isRefresh) {
                        this.snackBar.open(
                            API_RESPONSE_MESSAGES.sprintHighlightsTabRefreshFailure,
                            '', {duration: SNACKBAR_DURATION});
                    } else {
                        this.snackBar.open(this.utils.getApiErrorMessage(err) || API_RESPONSE_MESSAGES.someThingWentWrong,
                            '', {duration: SNACKBAR_DURATION});
                    }
                }
            );
    }

    getSprintHighlights(isRefresh = false, isAutoRefresh = false) {
        return this.retrospectiveService.getSprintHighlights(this.retrospectiveID, this.sprintID, isAutoRefresh)
            .takeUntil(this.destroy$)
            .do(
                response => {
                    this.sprintHighlights = response.data.Feedbacks;
                },
                err => {
                    if (isRefresh) {
                        this.snackBar.open(
                            API_RESPONSE_MESSAGES.sprintHighlightsTabRefreshFailure,
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
                            API_RESPONSE_MESSAGES.sprintHighlightsTabRefreshFailure,
                            '', {duration: SNACKBAR_DURATION});
                    } else {
                        this.snackBar.open(this.utils.getApiErrorMessage(err) || API_RESPONSE_MESSAGES.someThingWentWrong,
                            '', {duration: SNACKBAR_DURATION});
                    }
                }
            );
    }
}
