import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RetrospectiveDashboardComponent } from './retrospective-dashboard.component';

describe('RetrospectiveDashboardComponent', () => {
    let component: RetrospectiveDashboardComponent;
    let fixture: ComponentFixture<RetrospectiveDashboardComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [RetrospectiveDashboardComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(RetrospectiveDashboardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    xit('should create', () => {
        expect(component).toBeTruthy();
    });
});
