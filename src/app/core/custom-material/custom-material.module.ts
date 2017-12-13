import { MatButtonModule, MatInputModule, MatFormFieldModule,
  MatToolbarModule, MatTabsModule, MatTableModule, MatExpansionModule,
  MatSelectModule, MatCardModule, MatMenuModule, MatIconModule } from '@angular/material';
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
    MatSelectModule,
    MatCardModule,
    MatMenuModule,
    MatIconModule
  ],
  exports: [
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatToolbarModule,
    MatTabsModule,
    MatTableModule,
    MatExpansionModule,
    MatSelectModule,
    MatCardModule,
    MatMenuModule,
    MatIconModule
  ],
})
export class CustomMaterialModule { }
