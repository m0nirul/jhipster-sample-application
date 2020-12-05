import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { JhipsterSampleApplicationTestModule } from '../../../test.module';
import { SignatureValidationUpdateComponent } from 'app/entities/signature-validation/signature-validation-update.component';
import { SignatureValidationService } from 'app/entities/signature-validation/signature-validation.service';
import { SignatureValidation } from 'app/shared/model/signature-validation.model';

describe('Component Tests', () => {
  describe('SignatureValidation Management Update Component', () => {
    let comp: SignatureValidationUpdateComponent;
    let fixture: ComponentFixture<SignatureValidationUpdateComponent>;
    let service: SignatureValidationService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [JhipsterSampleApplicationTestModule],
        declarations: [SignatureValidationUpdateComponent],
        providers: [FormBuilder],
      })
        .overrideTemplate(SignatureValidationUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(SignatureValidationUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(SignatureValidationService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new SignatureValidation(123);
        spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
        comp.updateForm(entity);
        // WHEN
        comp.save();
        tick(); // simulate async

        // THEN
        expect(service.update).toHaveBeenCalledWith(entity);
        expect(comp.isSaving).toEqual(false);
      }));

      it('Should call create service on save for new entity', fakeAsync(() => {
        // GIVEN
        const entity = new SignatureValidation();
        spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
        comp.updateForm(entity);
        // WHEN
        comp.save();
        tick(); // simulate async

        // THEN
        expect(service.create).toHaveBeenCalledWith(entity);
        expect(comp.isSaving).toEqual(false);
      }));
    });
  });
});
