import { NgModule } from '@angular/core';
import {
    MatButtonModule, MatCardModule, MatExpansionModule, MatFormFieldModule, MatGridListModule, MatIconModule, MatInputModule,
    MatListModule, MatMenuModule, MatSelectModule, MatSidenavModule, MatTableModule, MatTabsModule, MatToolbarModule,
    MatTooltipModule, MatRadioModule, MatSnackBarModule, MatDialogModule
} from '@angular/material';

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
        MatTooltipModule,
        MatGridListModule,
        MatRadioModule,
        MatSnackBarModule,
        MatDialogModule,
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
        MatTooltipModule,
        MatGridListModule,
        MatRadioModule,
        MatSnackBarModule,
        MatDialogModule,
    ],
})
export class CustomMaterialModule {
}
