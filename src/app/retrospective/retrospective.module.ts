// Import Modules
import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MATERIAL_COMPATIBILITY_MODE, Md2Module } from 'md2';
import { AgGridModule } from 'ag-grid-angular';
import { CustomMaterialModule } from 'app/core/custom-material/custom-material.module';
import { SharedModule } from 'app/shared/shared.module';
import { RetrospectiveRoutingModule } from 'app/retrospective/retrospective-routing.module';
// Import Components
import { RetrospectiveListComponent } from 'app/retrospective/retrospective-list/retrospective-list.component';
import { RetrospectiveCreateComponent } from 'app/retrospective/retrospective-create/retrospective-create.component';
import { SprintDetailComponent } from 'app/retrospective/sprint-detail/sprint-detail.component';
import { SprintMemberSummaryComponent } from 'app/retrospective/sprint-member-summary/sprint-member-summary.component';
import { SprintTaskSummaryComponent } from 'app/retrospective/sprint-task-summary/sprint-task-summary.component';
import { RetrospectTaskModalComponent } from 'app/retrospective/retrospect-task-modal/retrospect-task-modal.component';
import { RetrospectiveDashboardComponent } from 'app/retrospective/retrospective-dashboard/retrospective-dashboard.component';
import { SprintListComponent } from 'app/retrospective/sprint-list/sprint-list.component';
import { SprintCreateComponent } from 'app/retrospective/sprint-create/sprint-create.component';
import { RetrospectiveFeedbackComponent } from 'app/retrospective/retrospective-feedback/retrospective-feedback.component';
import { SprintHighlightsComponent } from 'app/retrospective/sprint-highlights/sprint-highlights.component';
import { SprintNotesComponent } from 'app/retrospective/sprint-notes/sprint-notes.component';
import { SprintActivityLogComponent } from 'app/retrospective/sprint-activity-log/sprint-activity-log.component';


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
