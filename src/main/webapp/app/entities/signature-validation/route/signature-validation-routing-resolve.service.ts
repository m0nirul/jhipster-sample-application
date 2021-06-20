import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ISignatureValidation, SignatureValidation } from '../signature-validation.model';
import { SignatureValidationService } from '../service/signature-validation.service';

@Injectable({ providedIn: 'root' })
export class SignatureValidationRoutingResolveService implements Resolve<ISignatureValidation> {
  constructor(protected service: SignatureValidationService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ISignatureValidation> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((signatureValidation: HttpResponse<SignatureValidation>) => {
          if (signatureValidation.body) {
            return of(signatureValidation.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new SignatureValidation());
  }
}
