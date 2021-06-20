import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { SignatureValidationDetailComponent } from './signature-validation-detail.component';

describe('Component Tests', () => {
  describe('SignatureValidation Management Detail Component', () => {
    let comp: SignatureValidationDetailComponent;
    let fixture: ComponentFixture<SignatureValidationDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [SignatureValidationDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ signatureValidation: { id: 123 } }) },
          },
        ],
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
