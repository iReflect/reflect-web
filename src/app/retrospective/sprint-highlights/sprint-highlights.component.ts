import { Component, Input, OnInit } from '@angular/core';
import { RetrospectiveService } from '../../shared/services/retrospective.service';
import { MatSnackBar } from '@angular/material';
import {
    API_RESPONSE_MESSAGES, SNACKBAR_DURATION, SPRINT_HIGHLIGHT_TYPES,
    SPRINT_STATES
} from '../../../constants/app-constants';
import { FormControl, FormGroup } from '@angular/forms';
import * as _ from 'lodash';

@Component({
  selector: 'app-sprint-highlights',
  templateUrl: './sprint-highlights.component.html',
  styleUrls: ['./sprint-highlights.component.scss']
})
export class SprintHighlightsComponent implements OnInit {

    @Input() sprintDetails: any;
    @Input() retrospectiveID: any;

    data: any;
    highlightsFormGroup: FormGroup;
    sprintStates = SPRINT_STATES;
    highlightTypes = SPRINT_HIGHLIGHT_TYPES;

    constructor(private retrospectiveService: RetrospectiveService,
                private snackBar: MatSnackBar) { }

    ngOnInit() {
        this.data = this.sprintDetails;
        this.createSprintHighlightsFormGroup();
    }

    createSprintHighlightsFormGroup() {
        const isDisabled = this.data.Status === this.sprintStates.FROZEN;
        this.highlightsFormGroup = new FormGroup({
            'goodHighlights': new FormControl({value: this.data.GoodHighlights || '', disabled: isDisabled}),
            'okayHighlights': new FormControl({value: this.data.OkayHighlights || '', disabled: isDisabled}),
            'badHighlights': new FormControl({value: this.data.BadHighlights || '', disabled: isDisabled}),
        });
    }

    onHighlightBoxBlur(highlightType) {
        const sprintData = this.highlightsFormGroup.value;

        let highlightData, highlightKey;

        if (highlightType === this.highlightTypes.GOOD) {
            highlightData = (sprintData['goodHighlights'] || '').trim();
            highlightKey = 'GoodHighlights';
        } else if (highlightType === this.highlightTypes.OKAY) {
            highlightData = (sprintData['okayHighlights'] || '').trim();
            highlightKey = 'OkayHighlights';
        } else if (highlightType === this.highlightTypes.BAD) {
            highlightData = (sprintData['badHighlights'] || '').trim();
            highlightKey = 'BadHighlights';
        }

        if (this.data[highlightKey] && highlightData === this.data[highlightKey]) {
            this.resetForm();
            return;
        }

        const requestData = _.extend({}, this.data, {[highlightKey]: highlightData});

        this.retrospectiveService.updateSprintDetails(this.retrospectiveID, this.data.ID, requestData).subscribe(
            response => {
                this.data = response.data;
                this.snackBar.open(API_RESPONSE_MESSAGES.sprintHighlightsUpdateSuccess, '', {duration: SNACKBAR_DURATION});
                this.resetForm();
            },
            error => {
                this.snackBar.open(API_RESPONSE_MESSAGES.sprintHighlightsUpdateError, '', {duration: SNACKBAR_DURATION});
                this.resetForm();
            }
        );
    }

    resetForm() {
        this.highlightsFormGroup.patchValue({
            'goodHighlights': this.data.GoodHighlights,
            'okayHighlights': this.data.OkayHighlights,
            'badHighlights': this.data.BadHighlights,
        });
    }
}
