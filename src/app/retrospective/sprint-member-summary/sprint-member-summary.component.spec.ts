import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SprintMemberSummaryComponent } from 'app/retrospective/sprint-member-summary/sprint-member-summary.component';

describe('SprintMemberSummaryComponent', () => {
    let component: SprintMemberSummaryComponent;
    let fixture: ComponentFixture<SprintMemberSummaryComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SprintMemberSummaryComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SprintMemberSummaryComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    xit('should create', () => {
        expect(component).toBeTruthy();
    });
});
