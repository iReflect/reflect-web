import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatePickerEditorComponent } from 'app/shared/ag-grid-editors/date-picker-editor/date-picker-editor.component';

describe('SelectCellEditorComponent', () => {
    let component: DatePickerEditorComponent;
    let fixture: ComponentFixture<DatePickerEditorComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [DatePickerEditorComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DatePickerEditorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    xit('should create', () => {
        expect(component).toBeTruthy();
    });
});
