import { MatButtonModule, MatInputModule, MatFormFieldModule,
  MatToolbarModule, MatTabsModule, MatTableModule, MatExpansionModule, MatSelectModule } from '@angular/material';
import { NgModule } from '@angular/core';

@NgModule({
  imports: [
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatToolbarModule,
    MatTabsModule,
    MatTableModule,
    MatExpansionModule,
    MatSelectModule
  ],
  exports: [
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatToolbarModule,
    MatTabsModule,
    MatTableModule,
    MatExpansionModule,
    MatSelectModule
  ],
})
export class MyOwnCustomMaterialModule { }
