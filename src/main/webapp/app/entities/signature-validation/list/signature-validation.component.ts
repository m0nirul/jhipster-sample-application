import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ISignatureValidation } from '../signature-validation.model';
import { SignatureValidationService } from '../service/signature-validation.service';
import { SignatureValidationDeleteDialogComponent } from '../delete/signature-validation-delete-dialog.component';

@Component({
  selector: 'jhi-signature-validation',
  templateUrl: './signature-validation.component.html',
})
export class SignatureValidationComponent implements OnInit {
  signatureValidations?: ISignatureValidation[];
  isLoading = false;

  constructor(protected signatureValidationService: SignatureValidationService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.signatureValidationService.query().subscribe(
      (res: HttpResponse<ISignatureValidation[]>) => {
        this.isLoading = false;
        this.signatureValidations = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: ISignatureValidation): number {
    return item.id!;
  }

  delete(signatureValidation: ISignatureValidation): void {
    const modalRef = this.modalService.open(SignatureValidationDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.signatureValidation = signatureValidation;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
