import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { JhipsterSampleApplicationSharedModule } from 'app/shared/shared.module';
import { SignatureValidationComponent } from './signature-validation.component';
import { SignatureValidationDetailComponent } from './signature-validation-detail.component';
import { SignatureValidationUpdateComponent } from './signature-validation-update.component';
import { SignatureValidationDeleteDialogComponent } from './signature-validation-delete-dialog.component';
import { signatureValidationRoute } from './signature-validation.route';

@NgModule({
  imports: [JhipsterSampleApplicationSharedModule, RouterModule.forChild(signatureValidationRoute)],
  declarations: [
    SignatureValidationComponent,
    SignatureValidationDetailComponent,
    SignatureValidationUpdateComponent,
    SignatureValidationDeleteDialogComponent,
  ],
  entryComponents: [SignatureValidationDeleteDialogComponent],
})
export class JhipsterSampleApplicationSignatureValidationModule {}
