import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MatSnackBar } from '@angular/material';

import {
    RETRO_FEEDBACK_TYPES,
    SNACKBAR_DURATION,
    API_RESPONSE_MESSAGES,
    HIGHLIGHTS_LIST,
    RETRO_FEEDBACK_GOAL_TYPES
} from '../../../constants/app-constants';
import { RetrospectiveService } from '../../shared/services/retrospective.service';

@Component({
    selector: 'app-highlights',
    templateUrl: './highlights.component.html',
    styleUrls: ['./highlights.component.scss']
})
export class HighlightsComponent implements OnInit, OnChanges {
    highlightsList = HIGHLIGHTS_LIST;
    retroFeedbackTypes = RETRO_FEEDBACK_TYPES;
    goalTypes = RETRO_FEEDBACK_GOAL_TYPES;
    pendingGoals: any;
    accomplishedGoals: any;
    sprintHighlights: any;
    teamMembers: any;

    @Input() retrospectiveID;
    @Input() sprintID;
    @Input() sprintStatus;
    @Input() isTabActive: boolean;

    constructor(private retrospectiveService: RetrospectiveService,
        private snackBar: MatSnackBar) { }

    ngOnInit() {
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.isTabActive && changes.isTabActive.currentValue) {
            this.getTeamMembers();
            this.getSprintHighlights();
            this.getPendingGoals();
            this.getAccomplishedGoals();
        }
    }

    getPendingGoals() {
        this.retrospectiveService.getSprintGoals(this.retrospectiveID, this.sprintID, 'pending')
            .subscribe(
                response => {
                    this.pendingGoals = response.data.Feedbacks;
                },
                err => {
                    this.snackBar.open(
                        this.getErrorMessage(err.data) || API_RESPONSE_MESSAGES.sprintPendingGoalsGetError,
                        '', {duration: SNACKBAR_DURATION});
                }
            );
    }

    getAccomplishedGoals() {
        this.retrospectiveService.getSprintGoals(this.retrospectiveID, this.sprintID, 'completed')
            .subscribe(
                response => {
                    this.accomplishedGoals = response.data.Feedbacks;
                },
                err => {
                    this.snackBar.open(this.getErrorMessage(err.data) || API_RESPONSE_MESSAGES.sprintAccomplishedGoalsGetError,
                        '', {duration: SNACKBAR_DURATION});
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
                    this.snackBar.open(this.getErrorMessage(err.data) || API_RESPONSE_MESSAGES.sprintHighlightsGetError,
                        '', {duration: SNACKBAR_DURATION});
                }
            );
    }

    getTeamMembers() {
        this.retrospectiveService.getRetroMembers(this.retrospectiveID).subscribe(
            response => {
                this.teamMembers = response.data.Members;
            },
            err => {
                this.snackBar.open(this.getErrorMessage(err.data) || API_RESPONSE_MESSAGES.getRetrospectiveMembersError,
                    '', {duration: SNACKBAR_DURATION});
            }
        );
    }

    getErrorMessage(response): string {
        const message = response.error;
        return message.charAt(0).toUpperCase() + message.substr(1);
    }

}
