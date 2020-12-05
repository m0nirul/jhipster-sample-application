import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { ISignatureValidation } from 'app/shared/model/signature-validation.model';

type EntityResponseType = HttpResponse<ISignatureValidation>;
type EntityArrayResponseType = HttpResponse<ISignatureValidation[]>;

@Injectable({ providedIn: 'root' })
export class SignatureValidationService {
  public resourceUrl = SERVER_API_URL + 'api/signature-validations';

  constructor(protected http: HttpClient) {}

  create(signatureValidation: ISignatureValidation): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(signatureValidation);
    return this.http
      .post<ISignatureValidation>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(signatureValidation: ISignatureValidation): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(signatureValidation);
    return this.http
      .put<ISignatureValidation>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<ISignatureValidation>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<ISignatureValidation[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  protected convertDateFromClient(signatureValidation: ISignatureValidation): ISignatureValidation {
    const copy: ISignatureValidation = Object.assign({}, signatureValidation, {
      createdtime:
        signatureValidation.createdtime && signatureValidation.createdtime.isValid() ? signatureValidation.createdtime.toJSON() : undefined,
      validTill:
        signatureValidation.validTill && signatureValidation.validTill.isValid() ? signatureValidation.validTill.toJSON() : undefined,
    });
    return copy;
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.createdtime = res.body.createdtime ? moment(res.body.createdtime) : undefined;
      res.body.validTill = res.body.validTill ? moment(res.body.validTill) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((signatureValidation: ISignatureValidation) => {
        signatureValidation.createdtime = signatureValidation.createdtime ? moment(signatureValidation.createdtime) : undefined;
        signatureValidation.validTill = signatureValidation.validTill ? moment(signatureValidation.validTill) : undefined;
      });
    }
    return res;
  }
}
