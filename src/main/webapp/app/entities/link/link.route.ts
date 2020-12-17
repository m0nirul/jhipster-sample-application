import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { ILink, Link } from 'app/shared/model/link.model';
import { LinkService } from './link.service';
import { LinkComponent } from './link.component';
import { LinkDetailComponent } from './link-detail.component';
import { LinkUpdateComponent } from './link-update.component';

@Injectable({ providedIn: 'root' })
export class LinkResolve implements Resolve<ILink> {
  constructor(private service: LinkService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ILink> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((link: HttpResponse<Link>) => {
          if (link.body) {
            return of(link.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Link());
  }
}

export const linkRoute: Routes = [
  {
    path: '',
    component: LinkComponent,
    data: {
      authorities: [Authority.USER],
      pageTitle: 'Links',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: LinkDetailComponent,
    resolve: {
      link: LinkResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'Links',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: LinkUpdateComponent,
    resolve: {
      link: LinkResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'Links',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: LinkUpdateComponent,
    resolve: {
      link: LinkResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'Links',
    },
    canActivate: [UserRouteAccessService],
  },
];
