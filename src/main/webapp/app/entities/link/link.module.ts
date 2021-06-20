import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { LinkComponent } from './list/link.component';
import { LinkDetailComponent } from './detail/link-detail.component';
import { LinkUpdateComponent } from './update/link-update.component';
import { LinkDeleteDialogComponent } from './delete/link-delete-dialog.component';
import { LinkRoutingModule } from './route/link-routing.module';

@NgModule({
  imports: [SharedModule, LinkRoutingModule],
  declarations: [LinkComponent, LinkDetailComponent, LinkUpdateComponent, LinkDeleteDialogComponent],
  entryComponents: [LinkDeleteDialogComponent],
})
export class LinkModule {}
