import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { ILink, Link } from '../link.model';

import { LinkService } from './link.service';

describe('Service Tests', () => {
  describe('Link Service', () => {
    let service: LinkService;
    let httpMock: HttpTestingController;
    let elemDefault: ILink;
    let expectedResult: ILink | ILink[] | boolean | null;
    let currentDate: dayjs.Dayjs;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(LinkService);
      httpMock = TestBed.inject(HttpTestingController);
      currentDate = dayjs();

      elemDefault = {
        id: 0,
        zonedStartTime: currentDate,
        zonedDateTime: currentDate,
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign(
          {
            zonedStartTime: currentDate.format(DATE_TIME_FORMAT),
            zonedDateTime: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a Link', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
            zonedStartTime: currentDate.format(DATE_TIME_FORMAT),
            zonedDateTime: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            zonedStartTime: currentDate,
            zonedDateTime: currentDate,
          },
          returnedFromService
        );

        service.create(new Link()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Link', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            zonedStartTime: currentDate.format(DATE_TIME_FORMAT),
            zonedDateTime: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            zonedStartTime: currentDate,
            zonedDateTime: currentDate,
          },
          returnedFromService
        );

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Link', () => {
        const patchObject = Object.assign(
          {
            zonedDateTime: currentDate.format(DATE_TIME_FORMAT),
          },
          new Link()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign(
          {
            zonedStartTime: currentDate,
            zonedDateTime: currentDate,
          },
          returnedFromService
        );

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Link', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            zonedStartTime: currentDate.format(DATE_TIME_FORMAT),
            zonedDateTime: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            zonedStartTime: currentDate,
            zonedDateTime: currentDate,
          },
          returnedFromService
        );

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a Link', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addLinkToCollectionIfMissing', () => {
        it('should add a Link to an empty array', () => {
          const link: ILink = { id: 123 };
          expectedResult = service.addLinkToCollectionIfMissing([], link);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(link);
        });

        it('should not add a Link to an array that contains it', () => {
          const link: ILink = { id: 123 };
          const linkCollection: ILink[] = [
            {
              ...link,
            },
            { id: 456 },
          ];
          expectedResult = service.addLinkToCollectionIfMissing(linkCollection, link);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Link to an array that doesn't contain it", () => {
          const link: ILink = { id: 123 };
          const linkCollection: ILink[] = [{ id: 456 }];
          expectedResult = service.addLinkToCollectionIfMissing(linkCollection, link);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(link);
        });

        it('should add only unique Link to an array', () => {
          const linkArray: ILink[] = [{ id: 123 }, { id: 456 }, { id: 1909 }];
          const linkCollection: ILink[] = [{ id: 123 }];
          expectedResult = service.addLinkToCollectionIfMissing(linkCollection, ...linkArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const link: ILink = { id: 123 };
          const link2: ILink = { id: 456 };
          expectedResult = service.addLinkToCollectionIfMissing([], link, link2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(link);
          expect(expectedResult).toContain(link2);
        });

        it('should accept null and undefined values', () => {
          const link: ILink = { id: 123 };
          expectedResult = service.addLinkToCollectionIfMissing([], null, link, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(link);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
