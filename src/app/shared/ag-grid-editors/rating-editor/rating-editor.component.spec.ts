import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RatingEditorComponent } from './rating-editor.component';

describe('RatingEditorComponent', () => {
  let component: RatingEditorComponent;
  let fixture: ComponentFixture<RatingEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RatingEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RatingEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
