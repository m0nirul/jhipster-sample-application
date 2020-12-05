import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SignatureService } from 'app/entities/signature/signature.service';
import { ISignature, Signature } from 'app/shared/model/signature.model';
import { ValidationStatus } from 'app/shared/model/enumerations/validation-status.model';

describe('Service Tests', () => {
  describe('Signature Service', () => {
    let injector: TestBed;
    let service: SignatureService;
    let httpMock: HttpTestingController;
    let elemDefault: ISignature;
    let expectedResult: ISignature | ISignature[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      injector = getTestBed();
      service = injector.get(SignatureService);
      httpMock = injector.get(HttpTestingController);

      elemDefault = new Signature(0, 'AAAAAAA', 'AAAAAAA', 'AAAAAAA', 'AAAAAAA', ValidationStatus.VARIFIED);
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign({}, elemDefault);

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a Signature', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new Signature()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Signature', () => {
        const returnedFromService = Object.assign(
          {
            email: 'BBBBBB',
            name: 'BBBBBB',
            replyEmail: 'BBBBBB',
            replyName: 'BBBBBB',
            status: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Signature', () => {
        const returnedFromService = Object.assign(
          {
            email: 'BBBBBB',
            name: 'BBBBBB',
            replyEmail: 'BBBBBB',
            replyName: 'BBBBBB',
            status: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a Signature', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
