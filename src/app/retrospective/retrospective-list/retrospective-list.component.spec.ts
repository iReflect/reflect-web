import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RetrospectiveListComponent } from 'app/retrospective/retrospective-list/retrospective-list.component';

describe('RetrospectiveListComponent', () => {
    let component: RetrospectiveListComponent;
    let fixture: ComponentFixture<RetrospectiveListComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [RetrospectiveListComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(RetrospectiveListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    xit('should create', () => {
        expect(component).toBeTruthy();
    });
});
