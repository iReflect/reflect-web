import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyFeedbackDetailComponent } from './my-feedback-detail.component';

describe('MyFeedbackDetailComponent', () => {
    let component: MyFeedbackDetailComponent;
    let fixture: ComponentFixture<MyFeedbackDetailComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [MyFeedbackDetailComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MyFeedbackDetailComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    xit('should create', () => {
        expect(component).toBeTruthy();
    });
});
