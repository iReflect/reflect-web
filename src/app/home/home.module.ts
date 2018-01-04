import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CustomMaterialModule } from '../core/custom-material/custom-material.module';
import { FeedBackListDataSource } from '../feedback/feedback-list/feedback-list.data-source';
import { SharedModule } from '../shared/shared.module';
import { DashboardFeedbackListComponent } from './dashboard-feedback-list/dashboard-feedback-list.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeRoutingModule } from './home-routing.module';


@NgModule({
    imports: [
        CommonModule,
        HomeRoutingModule,
        SharedModule,
        CustomMaterialModule
    ],
    declarations: [
        DashboardComponent,
        DashboardFeedbackListComponent,
    ],
    exports: [],
    schemas: [
        FeedBackListDataSource
    ],
    providers: []
})
export class HomeModule {
}
