import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { CookieModule } from 'ngx-cookie';
import { RestangularModule } from 'ngx-restangular';
import { APP_ROUTE_URLS } from '../constants/app-constants';
import { AccountModule } from './account/account.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { CustomMaterialModule } from './core/custom-material/custom-material.module';
import { FeedbackModule } from './feedback/feedback.module';
import { HomeModule } from './home/home.module';

import { SharedModule } from './shared/shared.module';
import {SidenavComponent} from './sidenav/sidenav.component';

export function RestangularConfigFactory(RestangularProvider) {
    RestangularProvider.setDefaultHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    });
    RestangularProvider.setRequestSuffix('/');
    RestangularProvider.setDefaultHttpFields({withCredentials: true});
}

const routes: Routes = [
    { // Route to redirect to Home page if no url matches
        path: '**',
        redirectTo: APP_ROUTE_URLS.root
    }
];


@NgModule({
    declarations: [
        AppComponent,
        SidenavComponent
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
        RestangularModule.forRoot(RestangularConfigFactory),
        CustomMaterialModule,
        CoreModule,
        SharedModule,
        HomeModule,
        AccountModule,
        FeedbackModule
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
