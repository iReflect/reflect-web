import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
// Custom Pipes
import { ValuesPipe } from './pipes/values.pipe';
import { AuthService } from './services/auth.service';
import { FeedbackService } from './services/feedback.service';
import { TeamFeedbackService } from './services/team-feedback.service';
import { UserService } from './services/user.service';
import { UserStoreService } from './stores/user.store.service';
import { RestApiHelperService } from './utils/rest-api-helper.service';
import { UrlHelperService } from './utils/url-helper.service';
import { RetrospectiveService } from './services/retrospective.service';
import { CustomMaterialModule } from '../core/custom-material/custom-material.module';
import { TaskProviderComponent } from './task-provider/task-provider.component';
import { TaskProviderAuthComponent } from './task-provider-auth/task-provider-auth.component';
import { BasicModalComponent } from './basic-modal/basic-modal.component';
// Ag-grid components
import { AgGridModule } from 'ag-grid-angular';
import { RatingEditorComponent } from './ag-grid-editors/rating-editor/rating-editor.component';
import { NumericCellEditorComponent } from './ag-grid-editors/numeric-cell-editor/numeric-cell-editor.component';
import { PercentageRendererComponent } from './ag-grid-renderers/percentage-renderer/percentage-renderer.component';
import { RatingRendererComponent } from './ag-grid-renderers/rating-renderer/rating-renderer.component';
import { VacationRendererComponent } from './ag-grid-renderers/vacation-renderer/vacation-renderer.component';
import { DeleteButtonRendererComponent } from './ag-grid-renderers/delete-button-renderer/delete-button-renderer.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        HttpClientModule,
        RouterModule,
        ReactiveFormsModule,
        CustomMaterialModule,
        AgGridModule.withComponents([
            RatingEditorComponent,
            NumericCellEditorComponent,
            PercentageRendererComponent,
            RatingRendererComponent,
            VacationRendererComponent,
            DeleteButtonRendererComponent
        ])
    ],
    declarations: [
        ValuesPipe,
        TaskProviderAuthComponent,
        TaskProviderComponent,
        BasicModalComponent,
        PercentageRendererComponent,
        RatingRendererComponent,
        RatingEditorComponent,
        VacationRendererComponent,
        DeleteButtonRendererComponent,
        NumericCellEditorComponent
    ],
    exports: [
        ValuesPipe,
        TaskProviderComponent
    ],
    providers: [
        UrlHelperService,
        AuthService,
        UserService,
        FeedbackService,
        TeamFeedbackService,
        UserStoreService,
        RetrospectiveService,
        RestApiHelperService
    ],
    entryComponents: [
        BasicModalComponent
    ]
})
export class SharedModule {
}
