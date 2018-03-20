import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SprintDetailComponent } from './sprint-detail.component';

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

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
