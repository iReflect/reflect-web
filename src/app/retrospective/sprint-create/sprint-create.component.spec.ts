import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SprintCreateComponent } from './sprint-create.component';

describe('SprintCreateComponent', () => {
  let component: SprintCreateComponent;
  let fixture: ComponentFixture<SprintCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SprintCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SprintCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
