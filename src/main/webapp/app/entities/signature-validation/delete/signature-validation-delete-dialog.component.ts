import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ISignatureValidation } from '../signature-validation.model';
import { SignatureValidationService } from '../service/signature-validation.service';

@Component({
  templateUrl: './signature-validation-delete-dialog.component.html',
})
export class SignatureValidationDeleteDialogComponent {
  signatureValidation?: ISignatureValidation;

  constructor(protected signatureValidationService: SignatureValidationService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.signatureValidationService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
