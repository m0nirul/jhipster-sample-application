import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { SignatureValidationComponent } from '../list/signature-validation.component';
import { SignatureValidationDetailComponent } from '../detail/signature-validation-detail.component';
import { SignatureValidationUpdateComponent } from '../update/signature-validation-update.component';
import { SignatureValidationRoutingResolveService } from './signature-validation-routing-resolve.service';

const signatureValidationRoute: Routes = [
  {
    path: '',
    component: SignatureValidationComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: SignatureValidationDetailComponent,
    resolve: {
      signatureValidation: SignatureValidationRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: SignatureValidationUpdateComponent,
    resolve: {
      signatureValidation: SignatureValidationRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: SignatureValidationUpdateComponent,
    resolve: {
      signatureValidation: SignatureValidationRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(signatureValidationRoute)],
  exports: [RouterModule],
})
export class SignatureValidationRoutingModule {}
