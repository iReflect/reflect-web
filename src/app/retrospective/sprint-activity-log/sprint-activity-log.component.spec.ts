import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SprintActivityLogComponent } from './sprint-activity-log.component';

describe('SprintActivityLogComponent', () => {
  let component: SprintActivityLogComponent;
  let fixture: ComponentFixture<SprintActivityLogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SprintActivityLogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SprintActivityLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
