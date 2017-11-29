import { MatButtonModule, MatInputModule, MatFormFieldModule,
  MatToolbarModule, MatTabsModule, MatTableModule } from '@angular/material';
import { NgModule } from '@angular/core';

@NgModule({
  imports: [
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatToolbarModule,
    MatTabsModule,
    MatTableModule
  ],
  exports: [
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatToolbarModule,
    MatTabsModule,
    MatTableModule
  ],
})
export class MyOwnCustomMaterialModule { }
