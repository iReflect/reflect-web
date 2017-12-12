import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { RestangularModule } from 'ngx-restangular';
import { CookieModule } from 'ngx-cookie';

import { SharedModule } from './shared/shared.module';
import { CoreModule } from './core/core.module';
import { AppComponent } from './app.component';
import { HomeModule } from './home/home.module';
import { AccountModule } from './account/account.module';
import { FeedbackModule } from './feedback/feedback.module';

import { environment } from '../environments/environment';
import { CustomMaterialModule } from './core/custom-material/custom-material.module';

export function RestangularConfigFactory (RestangularProvider) {
  RestangularProvider.setBaseUrl(environment.apiHostUrl + environment.baseApiUrl);
  RestangularProvider.setDefaultHeaders({
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  });
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    CookieModule.forRoot(),
    RouterModule.forRoot([], {useHash: false}),
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
export class AppModule { }
