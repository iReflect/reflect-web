// Import Modules
import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MATERIAL_COMPATIBILITY_MODE, Md2Module } from 'md2';
import { AgGridModule } from 'ag-grid-angular';
import { CustomMaterialModule } from '../core/custom-material/custom-material.module';
import { SharedModule } from '../shared/shared.module';
import { RetrospectiveRoutingModule } from './retrospective-routing.module';
// Import Components
import { RetrospectiveListComponent } from './retrospective-list/retrospective-list.component';
import { RetrospectiveCreateComponent } from './retrospective-create/retrospective-create.component';
import { SprintDetailComponent } from './sprint-detail/sprint-detail.component';
import { SprintMemberSummaryComponent } from './sprint-member-summary/sprint-member-summary.component';
import { SprintTaskSummaryComponent } from './sprint-task-summary/sprint-task-summary.component';
import { RetrospectTaskModalComponent } from './retrospect-task-modal/retrospect-task-modal.component';
import { RetrospectiveDashboardComponent } from './retrospective-dashboard/retrospective-dashboard.component';
import { SprintListComponent } from './sprint-list/sprint-list.component';
import { SprintCreateComponent } from './sprint-create/sprint-create.component';
import { RetrospectiveFeedbackComponent } from './retrospective-feedback/retrospective-feedback.component';
import { SprintHighlightsComponent } from './sprint-highlights/sprint-highlights.component';
import { SprintNotesComponent } from './sprint-notes/sprint-notes.component';
import { SprintActivityLogComponent } from './sprint-activity-log/sprint-activity-log.component';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        Md2Module,
        AgGridModule.withComponents([]),
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
        SprintTaskSummaryComponent,
        RetrospectTaskModalComponent,
        RetrospectiveDashboardComponent,
        SprintListComponent,
        SprintCreateComponent,
        RetrospectiveFeedbackComponent,
        SprintHighlightsComponent,
        SprintNotesComponent,
        SprintActivityLogComponent,
    ],
    exports: [],
    providers: [
        DatePipe,
        {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true},
    ],
    entryComponents: [
        RetrospectiveCreateComponent,
        RetrospectTaskModalComponent,
        SprintCreateComponent
    ]
})
export class RetrospectiveModule {
}
