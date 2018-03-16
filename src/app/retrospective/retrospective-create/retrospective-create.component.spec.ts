import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RetrospectiveCreateComponent } from './retrospective-create.component';

describe('RetrospectiveCreateComponent', () => {
  let component: RetrospectiveCreateComponent;
  let fixture: ComponentFixture<RetrospectiveCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RetrospectiveCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RetrospectiveCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
