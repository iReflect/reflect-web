import { NgModule } from '@angular/core';
import { HomeComponent } from './home.component';
import { SharedModule } from '../shared/shared.module';
import { HomeRoutingModule } from './home-routing.module';
import { MyOwnCustomMaterialModule } from '../my-own-custom-material.module';
import { HomeService } from './home.service';
import { FeedBackEventDataSource } from './home.data-source';


@NgModule({
  imports: [
    HomeRoutingModule,
    SharedModule,
    MyOwnCustomMaterialModule
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
