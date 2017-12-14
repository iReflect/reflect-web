import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { SharedModule } from '../shared/shared.module';
import { HomeRoutingModule } from './home-routing.module';
import { HomeService } from './home.service';
import { FeedBackEventDataSource } from './home.data-source';
import { CustomMaterialModule } from '../core/custom-material/custom-material.module';


@NgModule({
  imports: [
    CommonModule,
    HomeRoutingModule,
    SharedModule,
    CustomMaterialModule
  ],
  declarations: [
    HomeComponent,
  ],
  exports: [],
  schemas: [
    FeedBackEventDataSource
  ],
  providers: [
    HomeService
  ]
})
export class HomeModule {}
