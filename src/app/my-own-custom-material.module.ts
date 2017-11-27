import { MatButtonModule, MatInputModule, MatFormFieldModule } from '@angular/material';
import { NgModule } from '@angular/core';

@NgModule({
  imports: [MatButtonModule, MatInputModule, MatFormFieldModule],
  exports: [MatButtonModule, MatInputModule, MatFormFieldModule],
})
export class MyOwnCustomMaterialModule { }
