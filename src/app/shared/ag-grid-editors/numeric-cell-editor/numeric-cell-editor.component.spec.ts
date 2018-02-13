import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NumericCellEditorComponent } from './numeric-cell-editor.component';

describe('NumericCellEditorComponent', () => {
  let component: NumericCellEditorComponent;
  let fixture: ComponentFixture<NumericCellEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NumericCellEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NumericCellEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
