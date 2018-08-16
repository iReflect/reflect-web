import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { CookieModule } from 'ngx-cookie';
import { RestangularModule } from 'ngx-restangular';
import { APP_ROUTE_URLS } from '@constants/app-constants';
import { AccountModule } from 'app/account/account.module';
import { AppComponent } from 'app/app.component';
import { CoreModule } from 'app/core/core.module';
import { CustomMaterialModule } from 'app/core/custom-material/custom-material.module';
import { FeedbackModule } from 'app/feedback/feedback.module';
import { HomeModule } from 'app/home/home.module';

import { SharedModule } from 'app/shared/shared.module';
import { SideNavComponent } from 'app/sidenav/sidenav.component';
import { RetrospectiveModule } from 'app/retrospective/retrospective.module';

const routes: Routes = [
    { // Route to redirect to Home page if no url matches
        path: '**',
        // TODO: Enable Feedbacks
        // redirectTo: APP_ROUTE_URLS.root,
        redirectTo: APP_ROUTE_URLS.retrospectiveList,
    }
];


@NgModule({
    declarations: [
        AppComponent,
        SideNavComponent
    ],
    imports: [
        CommonModule,
        BrowserModule,
        HttpClientModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        CookieModule.forRoot(),
        RouterModule.forRoot(routes, {useHash: false}),
        CustomMaterialModule,
        CoreModule,
        SharedModule,
        HomeModule,
        AccountModule,
        FeedbackModule,
        RetrospectiveModule,
    ],
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
