import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { ISignature } from 'app/shared/model/signature.model';

type EntityResponseType = HttpResponse<ISignature>;
type EntityArrayResponseType = HttpResponse<ISignature[]>;

@Injectable({ providedIn: 'root' })
export class SignatureService {
  public resourceUrl = SERVER_API_URL + 'api/signatures';

  constructor(protected http: HttpClient) {}

  create(signature: ISignature): Observable<EntityResponseType> {
    return this.http.post<ISignature>(this.resourceUrl, signature, { observe: 'response' });
  }

  update(signature: ISignature): Observable<EntityResponseType> {
    return this.http.put<ISignature>(this.resourceUrl, signature, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ISignature>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ISignature[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
