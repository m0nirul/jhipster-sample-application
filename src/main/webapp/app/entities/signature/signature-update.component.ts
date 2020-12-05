import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ISignature, Signature } from 'app/shared/model/signature.model';
import { SignatureService } from './signature.service';
import { ISignatureValidation } from 'app/shared/model/signature-validation.model';
import { SignatureValidationService } from 'app/entities/signature-validation/signature-validation.service';
import { IUser } from 'app/core/user/user.model';
import { UserService } from 'app/core/user/user.service';

type SelectableEntity = ISignatureValidation | IUser;

@Component({
  selector: 'jhi-signature-update',
  templateUrl: './signature-update.component.html',
})
export class SignatureUpdateComponent implements OnInit {
  isSaving = false;
  signaturevalidations: ISignatureValidation[] = [];
  users: IUser[] = [];

  editForm = this.fb.group({
    id: [],
    email: [null, [Validators.required, Validators.pattern('^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$')]],
    name: [null, [Validators.required]],
    replyEmail: [null, [Validators.pattern('^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$')]],
    replyName: [],
    status: [],
    signatureValidationId: [],
    ownerId: [],
  });

  constructor(
    protected signatureService: SignatureService,
    protected signatureValidationService: SignatureValidationService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ signature }) => {
      this.updateForm(signature);

      this.signatureValidationService
        .query({ filter: 'signature-is-null' })
        .pipe(
          map((res: HttpResponse<ISignatureValidation[]>) => {
            return res.body || [];
          })
        )
        .subscribe((resBody: ISignatureValidation[]) => {
          if (!signature.signatureValidationId) {
            this.signaturevalidations = resBody;
          } else {
            this.signatureValidationService
              .find(signature.signatureValidationId)
              .pipe(
                map((subRes: HttpResponse<ISignatureValidation>) => {
                  return subRes.body ? [subRes.body].concat(resBody) : resBody;
                })
              )
              .subscribe((concatRes: ISignatureValidation[]) => (this.signaturevalidations = concatRes));
          }
        });

      this.userService.query().subscribe((res: HttpResponse<IUser[]>) => (this.users = res.body || []));
    });
  }

  updateForm(signature: ISignature): void {
    this.editForm.patchValue({
      id: signature.id,
      email: signature.email,
      name: signature.name,
      replyEmail: signature.replyEmail,
      replyName: signature.replyName,
      status: signature.status,
      signatureValidationId: signature.signatureValidationId,
      ownerId: signature.ownerId,
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

  private createFromForm(): ISignature {
    return {
      ...new Signature(),
      id: this.editForm.get(['id'])!.value,
      email: this.editForm.get(['email'])!.value,
      name: this.editForm.get(['name'])!.value,
      replyEmail: this.editForm.get(['replyEmail'])!.value,
      replyName: this.editForm.get(['replyName'])!.value,
      status: this.editForm.get(['status'])!.value,
      signatureValidationId: this.editForm.get(['signatureValidationId'])!.value,
      ownerId: this.editForm.get(['ownerId'])!.value,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISignature>>): void {
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

  trackById(index: number, item: SelectableEntity): any {
    return item.id;
  }
}
