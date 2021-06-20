import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ISignature, Signature } from '../signature.model';
import { SignatureService } from '../service/signature.service';
import { ISignatureValidation } from 'app/entities/signature-validation/signature-validation.model';
import { SignatureValidationService } from 'app/entities/signature-validation/service/signature-validation.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

@Component({
  selector: 'jhi-signature-update',
  templateUrl: './signature-update.component.html',
})
export class SignatureUpdateComponent implements OnInit {
  isSaving = false;

  signatureValidationsCollection: ISignatureValidation[] = [];
  usersSharedCollection: IUser[] = [];

  editForm = this.fb.group({
    id: [],
    email: [null, [Validators.required, Validators.pattern('^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$')]],
    name: [null, [Validators.required]],
    replyEmail: [null, [Validators.pattern('^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$')]],
    replyName: [],
    status: [],
    signatureValidation: [],
    owner: [],
  });

  constructor(
    protected signatureService: SignatureService,
    protected signatureValidationService: SignatureValidationService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ signature }) => {
      this.updateForm(signature);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const signature = this.createFromForm();
    if (signature.id !== undefined) {
      this.subscribeToSaveResponse(this.signatureService.update(signature));
    } else {
      this.subscribeToSaveResponse(this.signatureService.create(signature));
    }
  }

  trackSignatureValidationById(index: number, item: ISignatureValidation): number {
    return item.id!;
  }

  trackUserById(index: number, item: IUser): string {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISignature>>): void {
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

  protected updateForm(signature: ISignature): void {
    this.editForm.patchValue({
      id: signature.id,
      email: signature.email,
      name: signature.name,
      replyEmail: signature.replyEmail,
      replyName: signature.replyName,
      status: signature.status,
      signatureValidation: signature.signatureValidation,
      owner: signature.owner,
    });

    this.signatureValidationsCollection = this.signatureValidationService.addSignatureValidationToCollectionIfMissing(
      this.signatureValidationsCollection,
      signature.signatureValidation
    );
    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing(this.usersSharedCollection, signature.owner);
  }

  protected loadRelationshipsOptions(): void {
    this.signatureValidationService
      .query({ filter: 'signature-is-null' })
      .pipe(map((res: HttpResponse<ISignatureValidation[]>) => res.body ?? []))
      .pipe(
        map((signatureValidations: ISignatureValidation[]) =>
          this.signatureValidationService.addSignatureValidationToCollectionIfMissing(
            signatureValidations,
            this.editForm.get('signatureValidation')!.value
          )
        )
      )
      .subscribe((signatureValidations: ISignatureValidation[]) => (this.signatureValidationsCollection = signatureValidations));

    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing(users, this.editForm.get('owner')!.value)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));
  }

  protected createFromForm(): ISignature {
    return {
      ...new Signature(),
      id: this.editForm.get(['id'])!.value,
      email: this.editForm.get(['email'])!.value,
      name: this.editForm.get(['name'])!.value,
      replyEmail: this.editForm.get(['replyEmail'])!.value,
      replyName: this.editForm.get(['replyName'])!.value,
      status: this.editForm.get(['status'])!.value,
      signatureValidation: this.editForm.get(['signatureValidation'])!.value,
      owner: this.editForm.get(['owner'])!.value,
    };
  }
}
