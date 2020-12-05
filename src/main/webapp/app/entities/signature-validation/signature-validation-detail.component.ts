import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ISignatureValidation } from 'app/shared/model/signature-validation.model';

@Component({
  selector: 'jhi-signature-validation-detail',
  templateUrl: './signature-validation-detail.component.html',
})
export class SignatureValidationDetailComponent implements OnInit {
  signatureValidation: ISignatureValidation | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ signatureValidation }) => (this.signatureValidation = signatureValidation));
  }

  previousState(): void {
    window.history.back();
  }
}
