import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskProviderComponent } from 'app/shared/task-provider/task-provider.component';

describe('TaskProviderComponent', () => {
    let component: TaskProviderComponent;
    let fixture: ComponentFixture<TaskProviderComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TaskProviderComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TaskProviderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    xit('should create', () => {
        expect(component).toBeTruthy();
    });
});
