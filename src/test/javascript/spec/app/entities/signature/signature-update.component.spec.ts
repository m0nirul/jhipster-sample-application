import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { JhipsterSampleApplicationTestModule } from '../../../test.module';
import { SignatureUpdateComponent } from 'app/entities/signature/signature-update.component';
import { SignatureService } from 'app/entities/signature/signature.service';
import { Signature } from 'app/shared/model/signature.model';

describe('Component Tests', () => {
  describe('Signature Management Update Component', () => {
    let comp: SignatureUpdateComponent;
    let fixture: ComponentFixture<SignatureUpdateComponent>;
    let service: SignatureService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [JhipsterSampleApplicationTestModule],
        declarations: [SignatureUpdateComponent],
        providers: [FormBuilder],
      })
        .overrideTemplate(SignatureUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(SignatureUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(SignatureService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new Signature(123);
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
        const entity = new Signature();
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
