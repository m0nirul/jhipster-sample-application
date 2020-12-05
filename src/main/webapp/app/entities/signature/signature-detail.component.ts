import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ISignature } from 'app/shared/model/signature.model';

@Component({
  selector: 'jhi-signature-detail',
  templateUrl: './signature-detail.component.html',
})
export class SignatureDetailComponent implements OnInit {
  signature: ISignature | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ signature }) => (this.signature = signature));
  }

  previousState(): void {
    window.history.back();
  }
}
