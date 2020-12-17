import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { ILink } from 'app/shared/model/link.model';

type EntityResponseType = HttpResponse<ILink>;
type EntityArrayResponseType = HttpResponse<ILink[]>;

@Injectable({ providedIn: 'root' })
export class LinkService {
  public resourceUrl = SERVER_API_URL + 'api/links';

  constructor(protected http: HttpClient) {}

  create(link: ILink): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(link);
    return this.http
      .post<ILink>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(link: ILink): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(link);
    return this.http
      .put<ILink>(this.resourceUrl, copy, { observe: 'response' })
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

  protected convertDateFromClient(link: ILink): ILink {
    const copy: ILink = Object.assign({}, link, {
      zonedStartTime: link.zonedStartTime && link.zonedStartTime.isValid() ? link.zonedStartTime.toJSON() : undefined,
      zonedDateTime: link.zonedDateTime && link.zonedDateTime.isValid() ? link.zonedDateTime.toJSON() : undefined,
    });
    return copy;
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.zonedStartTime = res.body.zonedStartTime ? moment(res.body.zonedStartTime) : undefined;
      res.body.zonedDateTime = res.body.zonedDateTime ? moment(res.body.zonedDateTime) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((link: ILink) => {
        link.zonedStartTime = link.zonedStartTime ? moment(link.zonedStartTime) : undefined;
        link.zonedDateTime = link.zonedDateTime ? moment(link.zonedDateTime) : undefined;
      });
    }
    return res;
  }
}
