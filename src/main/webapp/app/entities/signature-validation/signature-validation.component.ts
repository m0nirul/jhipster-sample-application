import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ISignatureValidation } from 'app/shared/model/signature-validation.model';
import { SignatureValidationService } from './signature-validation.service';
import { SignatureValidationDeleteDialogComponent } from './signature-validation-delete-dialog.component';

@Component({
  selector: 'jhi-signature-validation',
  templateUrl: './signature-validation.component.html',
})
export class SignatureValidationComponent implements OnInit, OnDestroy {
  signatureValidations?: ISignatureValidation[];
  eventSubscriber?: Subscription;

  constructor(
    protected signatureValidationService: SignatureValidationService,
    protected eventManager: JhiEventManager,
    protected modalService: NgbModal
  ) {}

  loadAll(): void {
    this.signatureValidationService
      .query()
      .subscribe((res: HttpResponse<ISignatureValidation[]>) => (this.signatureValidations = res.body || []));
  }

  ngOnInit(): void {
    this.loadAll();
    this.registerChangeInSignatureValidations();
  }

  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
    }
  }

  trackId(index: number, item: ISignatureValidation): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }

  registerChangeInSignatureValidations(): void {
    this.eventSubscriber = this.eventManager.subscribe('signatureValidationListModification', () => this.loadAll());
  }

  delete(signatureValidation: ISignatureValidation): void {
    const modalRef = this.modalService.open(SignatureValidationDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.signatureValidation = signatureValidation;
  }
}
