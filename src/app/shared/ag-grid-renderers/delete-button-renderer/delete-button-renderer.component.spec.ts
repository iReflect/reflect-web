import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteButtonRendererComponent } from './delete-button-renderer.component';

describe('DeleteButtonRendererComponent', () => {
  let component: DeleteButtonRendererComponent;
  let fixture: ComponentFixture<DeleteButtonRendererComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteButtonRendererComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteButtonRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
