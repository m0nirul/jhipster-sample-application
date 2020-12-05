import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { ISignature, Signature } from 'app/shared/model/signature.model';
import { SignatureService } from './signature.service';
import { SignatureComponent } from './signature.component';
import { SignatureDetailComponent } from './signature-detail.component';
import { SignatureUpdateComponent } from './signature-update.component';

@Injectable({ providedIn: 'root' })
export class SignatureResolve implements Resolve<ISignature> {
  constructor(private service: SignatureService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ISignature> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((signature: HttpResponse<Signature>) => {
          if (signature.body) {
            return of(signature.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Signature());
  }
}

export const signatureRoute: Routes = [
  {
    path: '',
    component: SignatureComponent,
    data: {
      authorities: [Authority.USER],
      pageTitle: 'Signatures',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: SignatureDetailComponent,
    resolve: {
      signature: SignatureResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'Signatures',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: SignatureUpdateComponent,
    resolve: {
      signature: SignatureResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'Signatures',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: SignatureUpdateComponent,
    resolve: {
      signature: SignatureResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'Signatures',
    },
    canActivate: [UserRouteAccessService],
  },
];
