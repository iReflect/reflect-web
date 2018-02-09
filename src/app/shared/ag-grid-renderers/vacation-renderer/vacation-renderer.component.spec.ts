import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VacationRendererComponent } from './vacation-renderer.component';

describe('VacationRendererComponent', () => {
  let component: VacationRendererComponent;
  let fixture: ComponentFixture<VacationRendererComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VacationRendererComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VacationRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
