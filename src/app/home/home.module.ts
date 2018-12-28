import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CustomMaterialModule } from 'app/core/custom-material/custom-material.module';
import { FeedBackListDataSource } from 'app/feedback/feedback-list/feedback-list.data-source';
import { SharedModule } from 'app/shared/shared.module';
import { DashboardFeedbackListComponent } from 'app/home/dashboard-feedback-list/dashboard-feedback-list.component';
import { DashboardComponent } from 'app/home/dashboard/dashboard.component';
import { HomeRoutingModule } from 'app/home/home-routing.module';


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
