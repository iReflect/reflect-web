import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
// Custom Pipes
import { ValuesPipe } from 'app/shared/pipes/values.pipe';
import { AuthService } from 'app/shared/services/auth.service';
import { FeedbackService } from 'app/shared/services/feedback.service';
import { TeamFeedbackService } from 'app/shared/services/team-feedback.service';
import { RetrospectiveDataService } from 'app/shared/services/retrospective-data.service';
import { UserService } from 'app/shared/services/user.service';
import { UserStoreService } from 'app/shared/stores/user.store.service';
import { RestApiHelperService } from 'app/shared/utils/rest-api-helper.service';
import { UrlHelperService } from 'app/shared/utils/url-helper.service';
import { RetrospectiveService } from 'app/shared/services/retrospective.service';
import { CustomMaterialModule } from 'app/core/custom-material/custom-material.module';
import { TaskProviderComponent } from 'app/shared/task-provider/task-provider.component';
import { TaskProviderAuthComponent } from 'app/shared/task-provider-auth/task-provider-auth.component';
import { BasicModalComponent } from 'app/shared/basic-modal/basic-modal.component';
// Ag-grid components
import { AgGridModule } from 'ag-grid-angular';
import { NumericCellEditorComponent } from 'app/shared/ag-grid-editors/numeric-cell-editor/numeric-cell-editor.component';
import { SelectCellEditorComponent } from 'app/shared/ag-grid-editors/select-cell-editor/select-cell-editor.component';
import { ClickableButtonRendererComponent } from 'app/shared/ag-grid-renderers/clickable-button-renderer/clickable-button-renderer.component';
import { RatingRendererComponent } from 'app/shared/ag-grid-renderers/rating-renderer/rating-renderer.component';
import { DatePickerEditorComponent } from 'app/shared/ag-grid-editors/date-picker-editor/date-picker-editor.component';
import { GridService } from 'app/shared/services/grid.service';
import { UtilsService } from 'app/shared/utils/utils.service';
import { OAuthCallbackService } from 'app/shared/services/o-auth-callback.service';

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
        GridService,
        OAuthCallbackService,
        RetrospectiveDataService,
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
