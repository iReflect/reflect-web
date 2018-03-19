import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {RetrospectiveService} from '../../shared/services/retrospective.service';
import {MatSnackBar} from '@angular/material';
import {
    RETRO_FEEDBACK_TYPES, SPRINT_NOTES_SECTIONS_LIST,
    SNACKBAR_DURATION, API_RESPONSE_MESSAGES
} from '../../../constants/app-constants';

@Component({
  selector: 'app-sprint-notes',
  templateUrl: './sprint-notes.component.html',
  styleUrls: ['./sprint-notes.component.scss']
})
export class SprintNotesComponent implements OnInit, OnChanges {

    @Input() retrospectiveID;
    @Input() sprintID;
    @Input() sprintStatus;
    @Input() isTabActive: boolean;

    notesSectionsList = SPRINT_NOTES_SECTIONS_LIST;
    retroFeedbackTypes = RETRO_FEEDBACK_TYPES;
    sprintGoals: any;
    sprintNotes: any;
    teamMembers: any;

    constructor(private retrospectiveService: RetrospectiveService,
                private snackBar: MatSnackBar) { }

    ngOnInit() {
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.isTabActive && changes.isTabActive.currentValue) {
            this.getTeamMembers();
            this.getSprintGoals();
            this.getSprintNotes();
        }
    }

    getSprintGoals() {
        this.retrospectiveService.getSprintGoals(
            this.retrospectiveID,
            this.sprintID,
            'added'
        ).subscribe(
            response => {
                this.sprintGoals = response.data.Feedbacks;
            },
            error => {
                this.snackBar.open('Couldn\'t get the sprint goals', '', {duration: SNACKBAR_DURATION});
            }
        );
    }

    getSprintNotes() {
        this.retrospectiveService.getSprintNotes(this.retrospectiveID, this.sprintID)
            .subscribe(
            response => {
                this.sprintNotes = response.data.Feedbacks;
            },
            error => {
                this.snackBar.open('Couldn\'t get the sprint notes', '', {duration: SNACKBAR_DURATION});
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
