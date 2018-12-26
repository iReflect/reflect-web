import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyFeedbackListComponent } from 'app/feedback/my-feedback-list/my-feedback-list.component';
describe('MyFeedbackListComponent', () => {
    let component: MyFeedbackListComponent;
    let fixture: ComponentFixture<MyFeedbackListComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [MyFeedbackListComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MyFeedbackListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    xit('should create', () => {
        expect(component).toBeTruthy();
    });
});
