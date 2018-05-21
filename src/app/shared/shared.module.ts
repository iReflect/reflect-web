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
import { NumericCellEditorComponent } from './ag-grid-editors/numeric-cell-editor/numeric-cell-editor.component';
import { SelectCellEditorComponent } from './ag-grid-editors/select-cell-editor/select-cell-editor.component';
import { ClickableButtonRendererComponent } from './ag-grid-renderers/clickable-button-renderer/clickable-button-renderer.component';
import { RatingRendererComponent } from './ag-grid-renderers/rating-renderer/rating-renderer.component';
import { DatePickerEditorComponent } from './ag-grid-editors/date-picker-editor/date-picker-editor.component';
import { UtilsService } from './utils/utils.service';
import { OAuthCallbackService } from './services/o-auth-callback.service';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        HttpClientModule,
        RouterModule,
        ReactiveFormsModule,
        CustomMaterialModule,
        AgGridModule.withComponents([
            NumericCellEditorComponent,
            SelectCellEditorComponent,
            RatingRendererComponent,
            ClickableButtonRendererComponent,
            DatePickerEditorComponent
        ])
    ],
    declarations: [
        ValuesPipe,
        TaskProviderAuthComponent,
        TaskProviderComponent,
        BasicModalComponent,
        NumericCellEditorComponent,
        SelectCellEditorComponent,
        RatingRendererComponent,
        ClickableButtonRendererComponent,
        DatePickerEditorComponent
    ],
    exports: [
        ValuesPipe,
        TaskProviderComponent
    ],
    providers: [
        UrlHelperService,
        AuthService,
        OAuthCallbackService,
        UserService,
        FeedbackService,
        TeamFeedbackService,
        UserStoreService,
        RetrospectiveService,
        RestApiHelperService,
        UtilsService
    ],
    entryComponents: [
        BasicModalComponent
    ]
})
export class SharedModule {
}
