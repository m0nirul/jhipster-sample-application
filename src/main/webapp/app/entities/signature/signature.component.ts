import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ISignature } from 'app/shared/model/signature.model';
import { SignatureService } from './signature.service';
import { SignatureDeleteDialogComponent } from './signature-delete-dialog.component';

@Component({
  selector: 'jhi-signature',
  templateUrl: './signature.component.html',
})
export class SignatureComponent implements OnInit, OnDestroy {
  signatures?: ISignature[];
  eventSubscriber?: Subscription;

  constructor(protected signatureService: SignatureService, protected eventManager: JhiEventManager, protected modalService: NgbModal) {}

  loadAll(): void {
    this.signatureService.query().subscribe((res: HttpResponse<ISignature[]>) => (this.signatures = res.body || []));
  }

  ngOnInit(): void {
    this.loadAll();
    this.registerChangeInSignatures();
  }

  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
    }
  }

  trackId(index: number, item: ISignature): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }

  registerChangeInSignatures(): void {
    this.eventSubscriber = this.eventManager.subscribe('signatureListModification', () => this.loadAll());
  }

  delete(signature: ISignature): void {
    const modalRef = this.modalService.open(SignatureDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.signature = signature;
  }
}
