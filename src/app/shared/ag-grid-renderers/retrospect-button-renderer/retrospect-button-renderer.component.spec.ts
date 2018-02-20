import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RetrospectButtonRendererComponent } from './retrospect-button-renderer.component';

describe('RestrospectButtonRendererComponent', () => {
  let component: RetrospectButtonRendererComponent;
  let fixture: ComponentFixture<RetrospectButtonRendererComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RetrospectButtonRendererComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RetrospectButtonRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
