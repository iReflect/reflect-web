import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SprintNotesComponent } from './sprint-notes.component';

describe('SprintNotesComponent', () => {
  let component: SprintNotesComponent;
  let fixture: ComponentFixture<SprintNotesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SprintNotesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SprintNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
