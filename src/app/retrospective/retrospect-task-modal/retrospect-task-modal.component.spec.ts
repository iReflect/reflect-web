import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RetrospectTaskModalComponent } from './retrospect-task-modal.component';

describe('RetrospectTaskModalComponent', () => {
  let component: RetrospectTaskModalComponent;
  let fixture: ComponentFixture<RetrospectTaskModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RetrospectTaskModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RetrospectTaskModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
