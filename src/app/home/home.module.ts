import { NgModule } from '@angular/core';
import { HomeComponent } from './home.component';
import { SharedModule } from '../shared/shared.module';
import { HomeRoutingModule } from './home-routing.module';


@NgModule({
  imports: [
    HomeRoutingModule,
    SharedModule,
  ],
  declarations: [
    HomeComponent
  ],
  exports: []
})
export class HomeModule {}
