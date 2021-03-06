import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicModalComponent } from 'app/shared/basic-modal/basic-modal.component';

describe('BasicModalComponent', () => {
    let component: BasicModalComponent;
    let fixture: ComponentFixture<BasicModalComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [BasicModalComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(BasicModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    xit('should create', () => {
        expect(component).toBeTruthy();
    });
});
