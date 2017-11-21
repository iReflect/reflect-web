import { NgModule } from '@angular/core';
import {MatButtonModule, MatCheckboxModule, MatToolbarModule,MatInputModule, MatSelectModule} from '@angular/material';


@NgModule({
  imports: [MatButtonModule, MatCheckboxModule, MatToolbarModule, MatInputModule, MatSelectModule],
  exports: [MatButtonModule, MatCheckboxModule, MatToolbarModule, MatInputModule, MatSelectModule],
})
export class CustomMaterialModule { }