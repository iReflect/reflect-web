import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

// Import Modules
import { CustomMaterialModule } from '../core/custom-material/custom-material.module';
import { SharedModule } from '../shared/shared.module';
import { RetrospectiveRoutingModule } from './retrospective-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Import Components
import { RetrospectiveListComponent } from './retrospective-list/retrospective-list.component';
import { RetrospectiveCreateComponent } from './retrospective-create/retrospective-create.component';
import { SprintDetailComponent } from './sprint-detail/sprint-detail.component';
import { AgGridModule } from 'ag-grid-angular';
import { SprintMemberSummaryComponent } from './sprint-member-summary/sprint-member-summary.component';
import { SprintTaskSummaryComponent } from './sprint-task-summary/sprint-task-summary.component';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        AgGridModule.withComponents([
            SprintMemberSummaryComponent
        ]),
        ReactiveFormsModule,
        CustomMaterialModule,
        SharedModule,
        RetrospectiveRoutingModule
    ],
    declarations: [
        RetrospectiveListComponent,
        SprintDetailComponent,
        RetrospectiveCreateComponent,
        SprintMemberSummaryComponent,
        SprintTaskSummaryComponent
    ],
    exports: [],
    providers: [],
    entryComponents: [
        RetrospectiveCreateComponent
    ]

})
export class RetrospectiveModule {
}
