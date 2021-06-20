import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { ISignatureValidation, SignatureValidation } from '../signature-validation.model';
import { SignatureValidationService } from '../service/signature-validation.service';

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
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ signatureValidation }) => {
      if (signatureValidation.id === undefined) {
        const today = dayjs().startOf('day');
        signatureValidation.createdtime = today;
        signatureValidation.validTill = today;
      }

      this.updateForm(signatureValidation);
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

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISignatureValidation>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(signatureValidation: ISignatureValidation): void {
    this.editForm.patchValue({
      id: signatureValidation.id,
      otp: signatureValidation.otp,
      createdtime: signatureValidation.createdtime ? signatureValidation.createdtime.format(DATE_TIME_FORMAT) : null,
      validTill: signatureValidation.validTill ? signatureValidation.validTill.format(DATE_TIME_FORMAT) : null,
      status: signatureValidation.status,
    });
  }

  protected createFromForm(): ISignatureValidation {
    return {
      ...new SignatureValidation(),
      id: this.editForm.get(['id'])!.value,
      otp: this.editForm.get(['otp'])!.value,
      createdtime: this.editForm.get(['createdtime'])!.value
        ? dayjs(this.editForm.get(['createdtime'])!.value, DATE_TIME_FORMAT)
        : undefined,
      validTill: this.editForm.get(['validTill'])!.value ? dayjs(this.editForm.get(['validTill'])!.value, DATE_TIME_FORMAT) : undefined,
      status: this.editForm.get(['status'])!.value,
    };
  }
}
