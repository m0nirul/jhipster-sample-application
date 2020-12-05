import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { ISignatureValidation } from 'app/shared/model/signature-validation.model';
import { SignatureValidationService } from './signature-validation.service';

@Component({
  templateUrl: './signature-validation-delete-dialog.component.html',
})
export class SignatureValidationDeleteDialogComponent {
  signatureValidation?: ISignatureValidation;

  constructor(
    protected signatureValidationService: SignatureValidationService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.signatureValidationService.delete(id).subscribe(() => {
      this.eventManager.broadcast('signatureValidationListModification');
      this.activeModal.close();
    });
  }
}
