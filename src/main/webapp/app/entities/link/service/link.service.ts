import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ILink, getLinkIdentifier } from '../link.model';

export type EntityResponseType = HttpResponse<ILink>;
export type EntityArrayResponseType = HttpResponse<ILink[]>;

@Injectable({ providedIn: 'root' })
export class LinkService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/links');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(link: ILink): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(link);
    return this.http
      .post<ILink>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(link: ILink): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(link);
    return this.http
      .put<ILink>(`${this.resourceUrl}/${getLinkIdentifier(link) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(link: ILink): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(link);
    return this.http
      .patch<ILink>(`${this.resourceUrl}/${getLinkIdentifier(link) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<ILink>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<ILink[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addLinkToCollectionIfMissing(linkCollection: ILink[], ...linksToCheck: (ILink | null | undefined)[]): ILink[] {
    const links: ILink[] = linksToCheck.filter(isPresent);
    if (links.length > 0) {
      const linkCollectionIdentifiers = linkCollection.map(linkItem => getLinkIdentifier(linkItem)!);
      const linksToAdd = links.filter(linkItem => {
        const linkIdentifier = getLinkIdentifier(linkItem);
        if (linkIdentifier == null || linkCollectionIdentifiers.includes(linkIdentifier)) {
          return false;
        }
        linkCollectionIdentifiers.push(linkIdentifier);
        return true;
      });
      return [...linksToAdd, ...linkCollection];
    }
    return linkCollection;
  }

  protected convertDateFromClient(link: ILink): ILink {
    return Object.assign({}, link, {
      zonedStartTime: link.zonedStartTime?.isValid() ? link.zonedStartTime.toJSON() : undefined,
      zonedDateTime: link.zonedDateTime?.isValid() ? link.zonedDateTime.toJSON() : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.zonedStartTime = res.body.zonedStartTime ? dayjs(res.body.zonedStartTime) : undefined;
      res.body.zonedDateTime = res.body.zonedDateTime ? dayjs(res.body.zonedDateTime) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((link: ILink) => {
        link.zonedStartTime = link.zonedStartTime ? dayjs(link.zonedStartTime) : undefined;
        link.zonedDateTime = link.zonedDateTime ? dayjs(link.zonedDateTime) : undefined;
      });
    }
    return res;
  }
}
