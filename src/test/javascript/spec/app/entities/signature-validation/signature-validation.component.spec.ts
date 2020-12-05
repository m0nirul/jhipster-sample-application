import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { JhipsterSampleApplicationTestModule } from '../../../test.module';
import { SignatureValidationComponent } from 'app/entities/signature-validation/signature-validation.component';
import { SignatureValidationService } from 'app/entities/signature-validation/signature-validation.service';
import { SignatureValidation } from 'app/shared/model/signature-validation.model';

describe('Component Tests', () => {
  describe('SignatureValidation Management Component', () => {
    let comp: SignatureValidationComponent;
    let fixture: ComponentFixture<SignatureValidationComponent>;
    let service: SignatureValidationService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [JhipsterSampleApplicationTestModule],
        declarations: [SignatureValidationComponent],
      })
        .overrideTemplate(SignatureValidationComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(SignatureValidationComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(SignatureValidationService);
    });

    it('Should call load all on init', () => {
      // GIVEN
      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new SignatureValidation(123)],
            headers,
          })
        )
      );

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.signatureValidations && comp.signatureValidations[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
