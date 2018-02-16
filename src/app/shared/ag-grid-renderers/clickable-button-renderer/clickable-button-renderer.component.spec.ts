import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClickableButtonRendererComponent } from './clickable-button-renderer.component';

describe('ClickableButtonRendererComponent', () => {
  let component: ClickableButtonRendererComponent;
  let fixture: ComponentFixture<ClickableButtonRendererComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClickableButtonRendererComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClickableButtonRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
