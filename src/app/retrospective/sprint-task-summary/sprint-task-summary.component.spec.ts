import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SprintTaskSummaryComponent } from './sprint-task-summary.component';

describe('SprintTaskSummaryComponent', () => {
    let component: SprintTaskSummaryComponent;
    let fixture: ComponentFixture<SprintTaskSummaryComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SprintTaskSummaryComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SprintTaskSummaryComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
