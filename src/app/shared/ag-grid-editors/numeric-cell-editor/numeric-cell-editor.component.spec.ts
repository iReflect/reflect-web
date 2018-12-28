import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NumericCellEditorComponent } from 'app/shared/ag-grid-editors/numeric-cell-editor/numeric-cell-editor.component';

describe('NumericCellEditorComponent', () => {
    let component: NumericCellEditorComponent;
    let fixture: ComponentFixture<NumericCellEditorComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [NumericCellEditorComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(NumericCellEditorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    xit('should create', () => {
        expect(component).toBeTruthy();
    });
});
