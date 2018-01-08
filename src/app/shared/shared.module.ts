import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
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

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        HttpClientModule,
        RouterModule,
    ],
    declarations: [
        ValuesPipe
    ],
    exports: [
        ValuesPipe
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
    ]
})
export class SharedModule {
}
