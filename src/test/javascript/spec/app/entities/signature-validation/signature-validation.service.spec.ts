import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { SignatureValidationService } from 'app/entities/signature-validation/signature-validation.service';
import { ISignatureValidation, SignatureValidation } from 'app/shared/model/signature-validation.model';
import { ValidationStatus } from 'app/shared/model/enumerations/validation-status.model';

describe('Service Tests', () => {
  describe('SignatureValidation Service', () => {
    let injector: TestBed;
    let service: SignatureValidationService;
    let httpMock: HttpTestingController;
    let elemDefault: ISignatureValidation;
    let expectedResult: ISignatureValidation | ISignatureValidation[] | boolean | null;
    let currentDate: moment.Moment;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      injector = getTestBed();
      service = injector.get(SignatureValidationService);
      httpMock = injector.get(HttpTestingController);
      currentDate = moment();

      elemDefault = new SignatureValidation(0, 'AAAAAAA', currentDate, currentDate, ValidationStatus.VARIFIED);
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

      it('should return a list of SignatureValidation', () => {
        const returnedFromService = Object.assign(
          {
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
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
