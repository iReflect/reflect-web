import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CustomMaterialModule } from '../core/custom-material/custom-material.module';
import { SharedModule } from '../shared/shared.module';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { HomeService } from './home.service';


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
    providers: [
        HomeService
    ]
})
export class HomeModule {
}
