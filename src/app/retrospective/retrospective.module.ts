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
import { BasicModalComponent } from '../shared/basic-modal/basic-modal.component';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        CustomMaterialModule,
        SharedModule,
        RetrospectiveRoutingModule
    ],
    declarations: [
        RetrospectiveListComponent,
        SprintDetailComponent,
        RetrospectiveCreateComponent
    ],
    exports: [],
    providers: [],
    entryComponents: [
        RetrospectiveCreateComponent
    ]

})
export class RetrospectiveModule {
}
