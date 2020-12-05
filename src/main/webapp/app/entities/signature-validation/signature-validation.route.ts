import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { ISignatureValidation, SignatureValidation } from 'app/shared/model/signature-validation.model';
import { SignatureValidationService } from './signature-validation.service';
import { SignatureValidationComponent } from './signature-validation.component';
import { SignatureValidationDetailComponent } from './signature-validation-detail.component';
import { SignatureValidationUpdateComponent } from './signature-validation-update.component';

@Injectable({ providedIn: 'root' })
export class SignatureValidationResolve implements Resolve<ISignatureValidation> {
  constructor(private service: SignatureValidationService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ISignatureValidation> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((signatureValidation: HttpResponse<SignatureValidation>) => {
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

export const signatureValidationRoute: Routes = [
  {
    path: '',
    component: SignatureValidationComponent,
    data: {
      authorities: [Authority.USER],
      pageTitle: 'SignatureValidations',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: SignatureValidationDetailComponent,
    resolve: {
      signatureValidation: SignatureValidationResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'SignatureValidations',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: SignatureValidationUpdateComponent,
    resolve: {
      signatureValidation: SignatureValidationResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'SignatureValidations',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: SignatureValidationUpdateComponent,
    resolve: {
      signatureValidation: SignatureValidationResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'SignatureValidations',
    },
    canActivate: [UserRouteAccessService],
  },
];
