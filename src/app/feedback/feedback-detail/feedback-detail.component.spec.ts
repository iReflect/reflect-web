import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackDetailComponent } from 'app/feedback/feedback-detail/feedback-detail.component';

describe('FeedbackDetailComponent', () => {
    let component: FeedbackDetailComponent;
    let fixture: ComponentFixture<FeedbackDetailComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [FeedbackDetailComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FeedbackDetailComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    xit('should create', () => {
        expect(component).toBeTruthy();
    });
});
