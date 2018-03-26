import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackListComponent } from './feedback-list.component';

describe('FeedbackListComponent', () => {
    let component: FeedbackListComponent;
    let fixture: ComponentFixture<FeedbackListComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [FeedbackListComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FeedbackListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    xit('should create', () => {
        expect(component).toBeTruthy();
    });
});
