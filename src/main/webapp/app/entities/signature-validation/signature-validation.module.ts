import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { SignatureValidationComponent } from './list/signature-validation.component';
import { SignatureValidationDetailComponent } from './detail/signature-validation-detail.component';
import { SignatureValidationUpdateComponent } from './update/signature-validation-update.component';
import { SignatureValidationDeleteDialogComponent } from './delete/signature-validation-delete-dialog.component';
import { SignatureValidationRoutingModule } from './route/signature-validation-routing.module';

@NgModule({
  imports: [SharedModule, SignatureValidationRoutingModule],
  declarations: [
    SignatureValidationComponent,
    SignatureValidationDetailComponent,
    SignatureValidationUpdateComponent,
    SignatureValidationDeleteDialogComponent,
  ],
  entryComponents: [SignatureValidationDeleteDialogComponent],
})
export class SignatureValidationModule {}
