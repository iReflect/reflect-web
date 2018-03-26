import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardFeedbackListComponent } from './dashboard-feedback-list.component';

describe('DashboardFeedbackListComponent', () => {
    let component: DashboardFeedbackListComponent;
    let fixture: ComponentFixture<DashboardFeedbackListComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [DashboardFeedbackListComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DashboardFeedbackListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    xit('should create', () => {
        expect(component).toBeTruthy();
    });
});
