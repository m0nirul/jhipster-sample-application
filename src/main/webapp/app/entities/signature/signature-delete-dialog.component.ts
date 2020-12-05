import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { ISignature } from 'app/shared/model/signature.model';
import { SignatureService } from './signature.service';

@Component({
  templateUrl: './signature-delete-dialog.component.html',
})
export class SignatureDeleteDialogComponent {
  signature?: ISignature;

  constructor(protected signatureService: SignatureService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.signatureService.delete(id).subscribe(() => {
      this.eventManager.broadcast('signatureListModification');
      this.activeModal.close();
    });
  }
}
