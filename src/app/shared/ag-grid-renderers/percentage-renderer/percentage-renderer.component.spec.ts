import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PercentageRendererComponent } from './percentage-renderer.component';

describe('PercentageRendererComponent', () => {
  let component: PercentageRendererComponent;
  let fixture: ComponentFixture<PercentageRendererComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PercentageRendererComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PercentageRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
