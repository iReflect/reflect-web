import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamFeedbackDetailComponent } from 'app/feedback/team-feedback-detail/team-feedback-detail.component';

describe('TeamFeedbackDetailComponent', () => {
    let component: TeamFeedbackDetailComponent;
    let fixture: ComponentFixture<TeamFeedbackDetailComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TeamFeedbackDetailComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TeamFeedbackDetailComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    xit('should create', () => {
        expect(component).toBeTruthy();
    });
});
