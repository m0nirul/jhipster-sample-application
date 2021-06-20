jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { ISignatureValidation, SignatureValidation } from '../signature-validation.model';
import { SignatureValidationService } from '../service/signature-validation.service';

import { SignatureValidationRoutingResolveService } from './signature-validation-routing-resolve.service';

describe('Service Tests', () => {
  describe('SignatureValidation routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: SignatureValidationRoutingResolveService;
    let service: SignatureValidationService;
    let resultSignatureValidation: ISignatureValidation | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(SignatureValidationRoutingResolveService);
      service = TestBed.inject(SignatureValidationService);
      resultSignatureValidation = undefined;
    });

    describe('resolve', () => {
      it('should return ISignatureValidation returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultSignatureValidation = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultSignatureValidation).toEqual({ id: 123 });
      });

      it('should return new ISignatureValidation if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultSignatureValidation = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultSignatureValidation).toEqual(new SignatureValidation());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultSignatureValidation = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultSignatureValidation).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
