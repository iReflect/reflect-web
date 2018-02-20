import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectCellEditorComponent } from './select-cell-editor.component';

describe('SelectCellEditorComponent', () => {
  let component: SelectCellEditorComponent;
  let fixture: ComponentFixture<SelectCellEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectCellEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectCellEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
