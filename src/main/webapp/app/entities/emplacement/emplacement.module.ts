import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { BiblioSharedModule } from 'app/shared/shared.module';
import { EmplacementComponent } from './emplacement.component';
import { EmplacementDetailComponent } from './emplacement-detail.component';
import { EmplacementUpdateComponent } from './emplacement-update.component';
import { EmplacementDeleteDialogComponent } from './emplacement-delete-dialog.component';
import { emplacementRoute } from './emplacement.route';

@NgModule({
  imports: [BiblioSharedModule, RouterModule.forChild(emplacementRoute)],
  declarations: [EmplacementComponent, EmplacementDetailComponent, EmplacementUpdateComponent, EmplacementDeleteDialogComponent],
  entryComponents: [EmplacementDeleteDialogComponent],
})
export class BiblioEmplacementModule {}
