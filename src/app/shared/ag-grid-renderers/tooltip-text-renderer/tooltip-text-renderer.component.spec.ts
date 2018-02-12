import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TooltipTextRendererComponent } from './tooltip-text-renderer.component';

describe('TooltipTextRendererComponent', () => {
  let component: TooltipTextRendererComponent;
  let fixture: ComponentFixture<TooltipTextRendererComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TooltipTextRendererComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TooltipTextRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
