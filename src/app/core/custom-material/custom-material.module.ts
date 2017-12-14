import { MatButtonModule, MatInputModule, MatFormFieldModule,
  MatToolbarModule, MatTabsModule, MatTableModule, MatExpansionModule,
  MatSelectModule, MatCardModule, MatMenuModule, MatIconModule, MatListModule, MatTooltipModule, MatSidenavModule } from '@angular/material';
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
    MatIconModule,
    MatListModule,
    MatSidenavModule,
    MatTooltipModule
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
    MatIconModule,
    MatListModule,
    MatSidenavModule,
    MatTooltipModule
  ],
})
export class CustomMaterialModule { }
