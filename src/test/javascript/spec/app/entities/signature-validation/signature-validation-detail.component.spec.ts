import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { JhipsterSampleApplicationTestModule } from '../../../test.module';
import { SignatureValidationDetailComponent } from 'app/entities/signature-validation/signature-validation-detail.component';
import { SignatureValidation } from 'app/shared/model/signature-validation.model';

describe('Component Tests', () => {
  describe('SignatureValidation Management Detail Component', () => {
    let comp: SignatureValidationDetailComponent;
    let fixture: ComponentFixture<SignatureValidationDetailComponent>;
    const route = ({ data: of({ signatureValidation: new SignatureValidation(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [JhipsterSampleApplicationTestModule],
        declarations: [SignatureValidationDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }],
      })
        .overrideTemplate(SignatureValidationDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(SignatureValidationDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load signatureValidation on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.signatureValidation).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
