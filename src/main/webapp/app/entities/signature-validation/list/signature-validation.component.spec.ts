import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { SignatureValidationService } from '../service/signature-validation.service';

import { SignatureValidationComponent } from './signature-validation.component';

describe('Component Tests', () => {
  describe('SignatureValidation Management Component', () => {
    let comp: SignatureValidationComponent;
    let fixture: ComponentFixture<SignatureValidationComponent>;
    let service: SignatureValidationService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [SignatureValidationComponent],
      })
        .overrideTemplate(SignatureValidationComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(SignatureValidationComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(SignatureValidationService);

      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [{ id: 123 }],
            headers,
          })
        )
      );
    });

    it('Should call load all on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.signatureValidations?.[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
