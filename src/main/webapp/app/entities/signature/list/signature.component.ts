import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ISignature } from '../signature.model';
import { SignatureService } from '../service/signature.service';
import { SignatureDeleteDialogComponent } from '../delete/signature-delete-dialog.component';

@Component({
  selector: 'jhi-signature',
  templateUrl: './signature.component.html',
})
export class SignatureComponent implements OnInit {
  signatures?: ISignature[];
  isLoading = false;

  constructor(protected signatureService: SignatureService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.signatureService.query().subscribe(
      (res: HttpResponse<ISignature[]>) => {
        this.isLoading = false;
        this.signatures = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: ISignature): number {
    return item.id!;
  }

  delete(signature: ISignature): void {
    const modalRef = this.modalService.open(SignatureDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.signature = signature;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
