import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

// Custom Services
import { UserDataStoreService } from './data-stores/user-data-store.service';
import { UtilsService } from './utils/utils.service';

// Custom Pipes
import { ValuesPipe } from './pipes/values.pipe';

@NgModule({
    imports: [
      CommonModule,
      FormsModule,
      HttpClientModule,
      RouterModule,
    ],
    declarations: [
      ValuesPipe
    ],
    exports: [
      ValuesPipe
    ],
    providers: [
      UserDataStoreService,
      UtilsService
    ]
})
export class SharedModule { }