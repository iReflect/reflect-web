import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SprintDetailComponent } from 'app/retrospective/sprint-detail/sprint-detail.component';

describe('SprintDetailComponent', () => {
    let component: SprintDetailComponent;
    let fixture: ComponentFixture<SprintDetailComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SprintDetailComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SprintDetailComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    xit('should create', () => {
        expect(component).toBeTruthy();
    });
});
