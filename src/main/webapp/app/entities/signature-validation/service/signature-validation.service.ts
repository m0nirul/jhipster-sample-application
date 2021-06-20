import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ISignatureValidation, getSignatureValidationIdentifier } from '../signature-validation.model';

export type EntityResponseType = HttpResponse<ISignatureValidation>;
export type EntityArrayResponseType = HttpResponse<ISignatureValidation[]>;

@Injectable({ providedIn: 'root' })
export class SignatureValidationService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/signature-validations');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(signatureValidation: ISignatureValidation): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(signatureValidation);
    return this.http
      .post<ISignatureValidation>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(signatureValidation: ISignatureValidation): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(signatureValidation);
    return this.http
      .put<ISignatureValidation>(`${this.resourceUrl}/${getSignatureValidationIdentifier(signatureValidation) as number}`, copy, {
        observe: 'response',
      })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(signatureValidation: ISignatureValidation): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(signatureValidation);
    return this.http
      .patch<ISignatureValidation>(`${this.resourceUrl}/${getSignatureValidationIdentifier(signatureValidation) as number}`, copy, {
        observe: 'response',
      })
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

  addSignatureValidationToCollectionIfMissing(
    signatureValidationCollection: ISignatureValidation[],
    ...signatureValidationsToCheck: (ISignatureValidation | null | undefined)[]
  ): ISignatureValidation[] {
    const signatureValidations: ISignatureValidation[] = signatureValidationsToCheck.filter(isPresent);
    if (signatureValidations.length > 0) {
      const signatureValidationCollectionIdentifiers = signatureValidationCollection.map(
        signatureValidationItem => getSignatureValidationIdentifier(signatureValidationItem)!
      );
      const signatureValidationsToAdd = signatureValidations.filter(signatureValidationItem => {
        const signatureValidationIdentifier = getSignatureValidationIdentifier(signatureValidationItem);
        if (signatureValidationIdentifier == null || signatureValidationCollectionIdentifiers.includes(signatureValidationIdentifier)) {
          return false;
        }
        signatureValidationCollectionIdentifiers.push(signatureValidationIdentifier);
        return true;
      });
      return [...signatureValidationsToAdd, ...signatureValidationCollection];
    }
    return signatureValidationCollection;
  }

  protected convertDateFromClient(signatureValidation: ISignatureValidation): ISignatureValidation {
    return Object.assign({}, signatureValidation, {
      createdtime: signatureValidation.createdtime?.isValid() ? signatureValidation.createdtime.toJSON() : undefined,
      validTill: signatureValidation.validTill?.isValid() ? signatureValidation.validTill.toJSON() : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.createdtime = res.body.createdtime ? dayjs(res.body.createdtime) : undefined;
      res.body.validTill = res.body.validTill ? dayjs(res.body.validTill) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((signatureValidation: ISignatureValidation) => {
        signatureValidation.createdtime = signatureValidation.createdtime ? dayjs(signatureValidation.createdtime) : undefined;
        signatureValidation.validTill = signatureValidation.validTill ? dayjs(signatureValidation.validTill) : undefined;
      });
    }
    return res;
  }
}
