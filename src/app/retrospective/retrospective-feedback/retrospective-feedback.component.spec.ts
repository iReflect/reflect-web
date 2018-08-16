import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RetrospectiveFeedbackComponent } from 'app/retrospective/retrospective-feedback/retrospective-feedback.component';

describe('RetrospectiveFeedbackComponent', () => {
    let component: RetrospectiveFeedbackComponent;
    let fixture: ComponentFixture<RetrospectiveFeedbackComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [RetrospectiveFeedbackComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(RetrospectiveFeedbackComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    xit('should create', () => {
        expect(component).toBeTruthy();
    });
});
