jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { SignatureValidationService } from '../service/signature-validation.service';
import { ISignatureValidation, SignatureValidation } from '../signature-validation.model';

import { SignatureValidationUpdateComponent } from './signature-validation-update.component';

describe('Component Tests', () => {
  describe('SignatureValidation Management Update Component', () => {
    let comp: SignatureValidationUpdateComponent;
    let fixture: ComponentFixture<SignatureValidationUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let signatureValidationService: SignatureValidationService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [SignatureValidationUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(SignatureValidationUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(SignatureValidationUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      signatureValidationService = TestBed.inject(SignatureValidationService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const signatureValidation: ISignatureValidation = { id: 456 };

        activatedRoute.data = of({ signatureValidation });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(signatureValidation));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const signatureValidation = { id: 123 };
        spyOn(signatureValidationService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ signatureValidation });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: signatureValidation }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(signatureValidationService.update).toHaveBeenCalledWith(signatureValidation);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const signatureValidation = new SignatureValidation();
        spyOn(signatureValidationService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ signatureValidation });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: signatureValidation }));
        saveSubject.complete();

        // THEN
        expect(signatureValidationService.create).toHaveBeenCalledWith(signatureValidation);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const signatureValidation = { id: 123 };
        spyOn(signatureValidationService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ signatureValidation });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(signatureValidationService.update).toHaveBeenCalledWith(signatureValidation);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });
  });
});
