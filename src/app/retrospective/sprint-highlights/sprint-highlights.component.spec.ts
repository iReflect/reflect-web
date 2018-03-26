import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SprintHighlightsComponent } from './sprint-highlights.component';

describe('SprintHighlightsComponent', () => {
    let component: SprintHighlightsComponent;
    let fixture: ComponentFixture<SprintHighlightsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SprintHighlightsComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SprintHighlightsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    xit('should create', () => {
        expect(component).toBeTruthy();
    });
});
