import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

// Import Modules
import { CustomMaterialModule } from '../core/custom-material/custom-material.module';
import { SharedModule } from '../shared/shared.module';
import { RetrospectiveRoutingModule } from './retrospective-routing.module';

// Import Components
import { RetrospectiveListComponent } from './retrospective-list/retrospective-list.component';
import { RetrospectiveCreateComponent } from './retrospective-create/retrospective-create.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RetrospectiveDashboardComponent } from './retrospective-dashboard/retrospective-dashboard.component';
import { SprintListComponent } from './sprint-list/sprint-list.component';
import { SprintCreateComponent } from './sprint-create/sprint-create.component';


@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        ReactiveFormsModule,
        CustomMaterialModule,
        RetrospectiveRoutingModule
    ],
    declarations: [
        RetrospectiveListComponent,
        RetrospectiveCreateComponent,
        RetrospectiveDashboardComponent,
        SprintListComponent,
        SprintCreateComponent,
    ],
    exports: [],
    providers: [],
    entryComponents: [
        SprintCreateComponent
    ]
})
export class RetrospectiveModule {
}
