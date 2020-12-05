import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';

import { ISignatureValidation, SignatureValidation } from 'app/shared/model/signature-validation.model';
import { SignatureValidationService } from './signature-validation.service';

@Component({
  selector: 'jhi-signature-validation-update',
  templateUrl: './signature-validation-update.component.html',
})
export class SignatureValidationUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    otp: [],
    createdtime: [],
    validTill: [],
    status: [],
  });

  constructor(
    protected signatureValidationService: SignatureValidationService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ signatureValidation }) => {
      if (!signatureValidation.id) {
        const today = moment().startOf('day');
        signatureValidation.createdtime = today;
        signatureValidation.validTill = today;
      }

      this.updateForm(signatureValidation);
    });
  }

  updateForm(signatureValidation: ISignatureValidation): void {
    this.editForm.patchValue({
      id: signatureValidation.id,
      otp: signatureValidation.otp,
      createdtime: signatureValidation.createdtime ? signatureValidation.createdtime.format(DATE_TIME_FORMAT) : null,
      validTill: signatureValidation.validTill ? signatureValidation.validTill.format(DATE_TIME_FORMAT) : null,
      status: signatureValidation.status,
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const signatureValidation = this.createFromForm();
    if (signatureValidation.id !== undefined) {
      this.subscribeToSaveResponse(this.signatureValidationService.update(signatureValidation));
    } else {
      this.subscribeToSaveResponse(this.signatureValidationService.create(signatureValidation));
    }
  }

  private createFromForm(): ISignatureValidation {
    return {
      ...new SignatureValidation(),
      id: this.editForm.get(['id'])!.value,
      otp: this.editForm.get(['otp'])!.value,
      createdtime: this.editForm.get(['createdtime'])!.value
        ? moment(this.editForm.get(['createdtime'])!.value, DATE_TIME_FORMAT)
        : undefined,
      validTill: this.editForm.get(['validTill'])!.value ? moment(this.editForm.get(['validTill'])!.value, DATE_TIME_FORMAT) : undefined,
      status: this.editForm.get(['status'])!.value,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISignatureValidation>>): void {
    result.subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError(): void {
    this.isSaving = false;
  }
}
