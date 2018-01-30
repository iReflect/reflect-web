import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

// Import Modules
import { CustomMaterialModule } from '../core/custom-material/custom-material.module';
import { SharedModule } from '../shared/shared.module';
import { RetrospectiveRoutingModule } from './retrospective-routing.module';

// Import Components
import { RetrospectiveListComponent } from './retrospective-list/retrospective-list.component';


@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        CustomMaterialModule,
        RetrospectiveRoutingModule
    ],
    declarations: [
        RetrospectiveListComponent,
    ],
    exports: [],
    providers: []
})
export class RetrospectiveModule {
}
