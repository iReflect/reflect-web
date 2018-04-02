import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { MatSnackBar } from '@angular/material';

import {
    API_RESPONSE_MESSAGES,
    RETRO_FEEDBACK_GOAL_TYPES,
    RETRO_FEEDBACK_TYPES,
    SNACKBAR_DURATION,
    SPRINT_NOTES_SECTIONS_LIST
} from '../../../constants/app-constants';
import { RetrospectiveService } from '../../shared/services/retrospective.service';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/observable/interval';
import { UtilsService } from '../../shared/utils/utils.service';

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
    @Input() isTabActive: boolean;
    @Input() refreshOnChange: boolean;

    notesSectionsList = SPRINT_NOTES_SECTIONS_LIST;
    retroFeedbackTypes = RETRO_FEEDBACK_TYPES;
    goalTypes = RETRO_FEEDBACK_GOAL_TYPES;
    sprintGoals: any;
    sprintNotes: any;
    teamMembers: any;
    autoRefreshCurrentState = true;
    destroy$: Subject<boolean> = new Subject<boolean>();

    constructor(
        private retrospectiveService: RetrospectiveService,
        private snackBar: MatSnackBar,
        private utils: UtilsService
    ) {
    }

    ngOnInit() {
        this.getSprintNotes(false);
        Observable.interval(5000)
            .takeUntil(this.destroy$)
            .subscribe(() => {
                if (this.autoRefreshCurrentState && this.isTabActive) {
                    this.getSprintNotes();
                }
            });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.isTabActive && changes.isTabActive.currentValue) {
            this.getSprintNotes();
        }
        if (changes.enableRefresh) {
            this.enableRefresh = changes.enableRefresh.currentValue;
            this.autoRefreshCurrentState = changes.enableRefresh.currentValue;
            if (this.autoRefreshCurrentState) {
                this.getSprintNotes();
            }
        }
        if (changes.refreshOnChange && this.isTabActive) {
            this.getSprintNotes();
        }
    }

    ngOnDestroy() {
        this.autoRefreshCurrentState = false;
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
    }

    getSprintNotes(isRefresh = true) {
        this.getTeamMembers(isRefresh);
        this.getSprintGoals(isRefresh);
        this.getSprintNotes(isRefresh);
    }

    pauseRefresh() {
        this.autoRefreshCurrentState = false;
    }

    resumeRefresh() {
        this.autoRefreshCurrentState = this.enableRefresh;
    }

    getSprintGoals(isRefresh = false) {
        this.retrospectiveService.getSprintGoals(
            this.retrospectiveID,
            this.sprintID,
            'added'
        ).subscribe(
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
    }

    getSprintNotes(isRefresh = false) {
        this.retrospectiveService.getSprintNotes(this.retrospectiveID, this.sprintID)
            .subscribe(
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
    }

    getTeamMembers(isRefresh = false) {
        this.retrospectiveService.getRetroMembers(this.retrospectiveID).subscribe(
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
    }
}
