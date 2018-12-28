import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskProviderAuthComponent } from 'app/shared/task-provider-auth/task-provider-auth.component';

describe('TaskProviderAuthComponent', () => {
    let component: TaskProviderAuthComponent;
    let fixture: ComponentFixture<TaskProviderAuthComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TaskProviderAuthComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TaskProviderAuthComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    xit('should create', () => {
        expect(component).toBeTruthy();
    });
});
