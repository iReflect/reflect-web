import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { MatSnackBar } from '@angular/material';

import {
    API_RESPONSE_MESSAGES,
    AUTO_REFRESH_DURATION,
    HIGHLIGHTS_LIST,
    RETRO_FEEDBACK_GOAL_TYPES,
    RETRO_FEEDBACK_TYPES,
    SNACKBAR_DURATION
} from '../../../constants/app-constants';
import { RetrospectiveService } from '../../shared/services/retrospective.service';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/observable/interval';
import { UtilsService } from '../../shared/utils/utils.service';

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
    destroy$: Subject<boolean> = new Subject<boolean>();

    @Input() enableRefresh: boolean;
    @Input() retrospectiveID;
    @Input() sprintID;
    @Input() sprintStatus;
    @Input() sprintEndDate;
    @Input() isTabActive: boolean;
    @Input() refreshOnChange: boolean;

    constructor(
        private retrospectiveService: RetrospectiveService,
        private snackBar: MatSnackBar,
        private utils: UtilsService
    ) {
    }

    ngOnInit() {
        this.getSprintHighlightsTab(false);
        Observable.interval(AUTO_REFRESH_DURATION)
            .takeUntil(this.destroy$)
            .subscribe(() => {
                if (this.autoRefreshCurrentState && this.isTabActive) {
                    this.getSprintHighlightsTab();
                }
            });
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.isTabActive && changes.isTabActive.currentValue) {
            this.getSprintHighlightsTab();
        }
        if (changes.enableRefresh) {
            this.enableRefresh = changes.enableRefresh.currentValue;
            this.autoRefreshCurrentState = changes.enableRefresh.currentValue;
            if (this.autoRefreshCurrentState) {
                this.getSprintHighlightsTab();
            }
        }
        if (changes.refreshOnChange && this.isTabActive) {
            this.getSprintHighlightsTab();
        }
    }

    ngOnDestroy() {
        this.autoRefreshCurrentState = false;
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
    }

    getSprintHighlightsTab(isRefresh = true) {
        this.getTeamMembers(isRefresh);
        this.getSprintHighlights(isRefresh);
        this.getPendingGoals(isRefresh);
        this.getAccomplishedGoals(isRefresh);
    }

    pauseRefresh() {
        this.autoRefreshCurrentState = false;
    }

    resumeRefresh() {
        this.autoRefreshCurrentState = this.enableRefresh;
    }

    getPendingGoals(isRefresh = false) {
        this.retrospectiveService.getSprintGoals(this.retrospectiveID, this.sprintID, 'pending')
            .subscribe(
                response => {
                    this.pendingGoals = response.data.Feedbacks;
                },
                err => {
                    if (isRefresh) {
                        this.snackBar.open(
                            API_RESPONSE_MESSAGES.sprintHighlightsTabRefreshFailure,
                            '', {duration: SNACKBAR_DURATION});
                    } else {
                        this.snackBar.open(this.utils.getApiErrorMessage(err) || API_RESPONSE_MESSAGES.sprintPendingGoalsGetError,
                            '', {duration: SNACKBAR_DURATION});
                    }
                }
            );
    }

    getAccomplishedGoals(isRefresh = false) {
        this.retrospectiveService.getSprintGoals(this.retrospectiveID, this.sprintID, 'completed')
            .subscribe(
                response => {
                    this.accomplishedGoals = response.data.Feedbacks;
                },
                err => {
                    if (isRefresh) {
                        this.snackBar.open(
                            API_RESPONSE_MESSAGES.sprintHighlightsTabRefreshFailure,
                            '', {duration: SNACKBAR_DURATION});
                    } else {
                        this.snackBar.open(this.utils.getApiErrorMessage(err) || API_RESPONSE_MESSAGES.sprintAccomplishedGoalsGetError,
                            '', {duration: SNACKBAR_DURATION});
                    }
                }
            );
    }

    getSprintHighlights(isRefresh = false) {
        this.retrospectiveService.getSprintHighlights(this.retrospectiveID, this.sprintID)
            .subscribe(
                response => {
                    this.sprintHighlights = response.data.Feedbacks;
                },
                err => {
                    if (isRefresh) {
                        this.snackBar.open(
                            API_RESPONSE_MESSAGES.sprintHighlightsTabRefreshFailure,
                            '', {duration: SNACKBAR_DURATION});
                    } else {
                        this.snackBar.open(this.utils.getApiErrorMessage(err) || API_RESPONSE_MESSAGES.sprintHighlightsGetError,
                            '', {duration: SNACKBAR_DURATION});
                    }
                }
            );
    }

    getTeamMembers(isRefresh = false) {
        this.retrospectiveService.getRetroMembers(this.retrospectiveID).subscribe(
            response => {
                this.teamMembers = response.data.Members;
            },
            err => {
                if (isRefresh) {
                    this.snackBar.open(
                        API_RESPONSE_MESSAGES.sprintHighlightsTabRefreshFailure,
                        '', {duration: SNACKBAR_DURATION});
                } else {
                    this.snackBar.open(this.utils.getApiErrorMessage(err) || API_RESPONSE_MESSAGES.getRetrospectiveMembersError,
                        '', {duration: SNACKBAR_DURATION});
                }
            }
        );
    }
}
