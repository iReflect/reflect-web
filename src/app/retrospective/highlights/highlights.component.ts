import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { MatSnackBar } from '@angular/material';

import {
    RETRO_FEEDBACK_TYPES,
    SNACKBAR_DURATION,
    API_RESPONSE_MESSAGES,
    HIGHLIGHTS_LIST,
    RETRO_FEEDBACK_GOAL_TYPES
} from '../../../constants/app-constants';
import { RetrospectiveService } from '../../shared/services/retrospective.service';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/observable/interval';

@Component({
    selector: 'app-highlights',
    templateUrl: './highlights.component.html',
    styleUrls: ['./highlights.component.scss']
})
export class HighlightsComponent implements OnInit, OnChanges, OnDestroy {
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
    @Input() isTabActive: boolean;

    constructor(private retrospectiveService: RetrospectiveService,
        private snackBar: MatSnackBar) { }

    ngOnInit() {
        Observable.interval(5000)
            .takeUntil(this.destroy$)
            .subscribe(() => {
                if (this.autoRefreshCurrentState && this.isTabActive) {
                    this.refreshTab();
                }
            });
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.isTabActive && changes.isTabActive.currentValue) {
            this.refreshTab();
        }
        if (changes.enableRefresh) {
            this.enableRefresh = changes.enableRefresh.currentValue;
            this.autoRefreshCurrentState = changes.enableRefresh.currentValue;
            if (this.autoRefreshCurrentState) {
                this.refreshTab();
            }
        }
    }

    ngOnDestroy() {
        this.autoRefreshCurrentState = false;
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
    }

    refreshTab() {
        this.getTeamMembers();
        this.getSprintHighlights();
        this.getPendingGoals();
        this.getAccomplishedGoals();
    }

    pauseRefresh() {
        this.autoRefreshCurrentState = false;
    }

    resumeRefresh() {
        this.autoRefreshCurrentState = true;
    }

    getPendingGoals() {
        this.retrospectiveService.getSprintGoals(this.retrospectiveID, this.sprintID, 'pending')
            .subscribe(
                response => {
                    this.pendingGoals = response.data.Feedbacks;
                },
                err => {
                    this.snackBar.open('Couldn\'t get the pending goals', '', {duration: SNACKBAR_DURATION});
                }
            );
    }

    getAccomplishedGoals() {
        this.retrospectiveService.getSprintGoals(this.retrospectiveID, this.sprintID, 'completed')
            .subscribe(
                response => {
                    this.accomplishedGoals = response.data.Feedbacks;
                },
                error => {
                    this.snackBar.open('Couldn\'t get the accomplished goals', '', {duration: SNACKBAR_DURATION});
                }
            );
    }

    getSprintHighlights() {
        this.retrospectiveService.getSprintHighlights(this.retrospectiveID, this.sprintID)
            .subscribe(
                response => {
                    this.sprintHighlights = response.data.Feedbacks;
                },
                err => {
                    this.snackBar.open('Couldn\'t get the sprint highlights', '', {duration: SNACKBAR_DURATION});
                }
            );
    }

    getTeamMembers() {
        this.retrospectiveService.getRetroMembers(this.retrospectiveID).subscribe(
            response => {
                this.teamMembers = response.data.Members;
            },
            () => {
                this.snackBar.open(API_RESPONSE_MESSAGES.getRetrospectiveMembersError, '', {duration: SNACKBAR_DURATION});
            }
        );
    }
}
