import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RatingRendererComponent } from 'app/shared/ag-grid-renderers/rating-renderer/rating-renderer.component';

describe('RatingRendererComponent', () => {
    let component: RatingRendererComponent;
    let fixture: ComponentFixture<RatingRendererComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [RatingRendererComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(RatingRendererComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    xit('should create', () => {
        expect(component).toBeTruthy();
    });
});
