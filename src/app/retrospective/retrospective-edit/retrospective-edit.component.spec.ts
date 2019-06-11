import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RetrospectiveEditComponent } from 'app/retrospective/retrospective-edit/retrospective-edit.component';

describe('RetrospectiveEditComponent', () => {
    let component: RetrospectiveEditComponent;
    let fixture: ComponentFixture<RetrospectiveEditComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [RetrospectiveEditComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(RetrospectiveEditComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    xit('should create', () => {
        expect(component).toBeTruthy();
    });
});
