import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { LinkComponent } from '../list/link.component';
import { LinkDetailComponent } from '../detail/link-detail.component';
import { LinkUpdateComponent } from '../update/link-update.component';
import { LinkRoutingResolveService } from './link-routing-resolve.service';

const linkRoute: Routes = [
  {
    path: '',
    component: LinkComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: LinkDetailComponent,
    resolve: {
      link: LinkRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: LinkUpdateComponent,
    resolve: {
      link: LinkRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: LinkUpdateComponent,
    resolve: {
      link: LinkRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(linkRoute)],
  exports: [RouterModule],
})
export class LinkRoutingModule {}
