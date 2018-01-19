import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SprintListComponent } from './sprint-list.component';

describe('SprintListComponent', () => {
  let component: SprintListComponent;
  let fixture: ComponentFixture<SprintListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SprintListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SprintListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
