import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Component } from './feedback-form-list.component';

describe('Component', () => {
  let component: Component;
  let fixture: ComponentFixture<Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
