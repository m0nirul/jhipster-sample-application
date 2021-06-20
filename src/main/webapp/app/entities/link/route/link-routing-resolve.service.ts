import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ILink, Link } from '../link.model';
import { LinkService } from '../service/link.service';

@Injectable({ providedIn: 'root' })
export class LinkRoutingResolveService implements Resolve<ILink> {
  constructor(protected service: LinkService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ILink> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((link: HttpResponse<Link>) => {
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
