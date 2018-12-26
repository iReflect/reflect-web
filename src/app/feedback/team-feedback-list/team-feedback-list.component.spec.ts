import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamFeedbackListComponent } from 'app/feedback/team-feedback-list/team-feedback-list.component';

describe('TeamFeedbackListComponent', () => {
    let component: TeamFeedbackListComponent;
    let fixture: ComponentFixture<TeamFeedbackListComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TeamFeedbackListComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TeamFeedbackListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    xit('should create', () => {
        expect(component).toBeTruthy();
    });
});
