import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { ValidationStatus } from 'app/entities/enumerations/validation-status.model';
import { ISignatureValidation, SignatureValidation } from '../signature-validation.model';

import { SignatureValidationService } from './signature-validation.service';

describe('Service Tests', () => {
  describe('SignatureValidation Service', () => {
    let service: SignatureValidationService;
    let httpMock: HttpTestingController;
    let elemDefault: ISignatureValidation;
    let expectedResult: ISignatureValidation | ISignatureValidation[] | boolean | null;
    let currentDate: dayjs.Dayjs;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(SignatureValidationService);
      httpMock = TestBed.inject(HttpTestingController);
      currentDate = dayjs();

      elemDefault = {
        id: 0,
        otp: 'AAAAAAA',
        createdtime: currentDate,
        validTill: currentDate,
        status: ValidationStatus.VARIFIED,
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign(
          {
            createdtime: currentDate.format(DATE_TIME_FORMAT),
            validTill: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a SignatureValidation', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
            createdtime: currentDate.format(DATE_TIME_FORMAT),
            validTill: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            createdtime: currentDate,
            validTill: currentDate,
          },
          returnedFromService
        );

        service.create(new SignatureValidation()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a SignatureValidation', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            otp: 'BBBBBB',
            createdtime: currentDate.format(DATE_TIME_FORMAT),
            validTill: currentDate.format(DATE_TIME_FORMAT),
            status: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            createdtime: currentDate,
            validTill: currentDate,
          },
          returnedFromService
        );

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a SignatureValidation', () => {
        const patchObject = Object.assign({}, new SignatureValidation());

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign(
          {
            createdtime: currentDate,
            validTill: currentDate,
          },
          returnedFromService
        );

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of SignatureValidation', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            otp: 'BBBBBB',
            createdtime: currentDate.format(DATE_TIME_FORMAT),
            validTill: currentDate.format(DATE_TIME_FORMAT),
            status: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            createdtime: currentDate,
            validTill: currentDate,
          },
          returnedFromService
        );

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a SignatureValidation', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addSignatureValidationToCollectionIfMissing', () => {
        it('should add a SignatureValidation to an empty array', () => {
          const signatureValidation: ISignatureValidation = { id: 123 };
          expectedResult = service.addSignatureValidationToCollectionIfMissing([], signatureValidation);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(signatureValidation);
        });

        it('should not add a SignatureValidation to an array that contains it', () => {
          const signatureValidation: ISignatureValidation = { id: 123 };
          const signatureValidationCollection: ISignatureValidation[] = [
            {
              ...signatureValidation,
            },
            { id: 456 },
          ];
          expectedResult = service.addSignatureValidationToCollectionIfMissing(signatureValidationCollection, signatureValidation);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a SignatureValidation to an array that doesn't contain it", () => {
          const signatureValidation: ISignatureValidation = { id: 123 };
          const signatureValidationCollection: ISignatureValidation[] = [{ id: 456 }];
          expectedResult = service.addSignatureValidationToCollectionIfMissing(signatureValidationCollection, signatureValidation);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(signatureValidation);
        });

        it('should add only unique SignatureValidation to an array', () => {
          const signatureValidationArray: ISignatureValidation[] = [{ id: 123 }, { id: 456 }, { id: 87535 }];
          const signatureValidationCollection: ISignatureValidation[] = [{ id: 123 }];
          expectedResult = service.addSignatureValidationToCollectionIfMissing(signatureValidationCollection, ...signatureValidationArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const signatureValidation: ISignatureValidation = { id: 123 };
          const signatureValidation2: ISignatureValidation = { id: 456 };
          expectedResult = service.addSignatureValidationToCollectionIfMissing([], signatureValidation, signatureValidation2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(signatureValidation);
          expect(expectedResult).toContain(signatureValidation2);
        });

        it('should accept null and undefined values', () => {
          const signatureValidation: ISignatureValidation = { id: 123 };
          expectedResult = service.addSignatureValidationToCollectionIfMissing([], null, signatureValidation, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(signatureValidation);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
