jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { SignatureService } from '../service/signature.service';
import { ISignature, Signature } from '../signature.model';
import { ISignatureValidation } from 'app/entities/signature-validation/signature-validation.model';
import { SignatureValidationService } from 'app/entities/signature-validation/service/signature-validation.service';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

import { SignatureUpdateComponent } from './signature-update.component';

describe('Component Tests', () => {
  describe('Signature Management Update Component', () => {
    let comp: SignatureUpdateComponent;
    let fixture: ComponentFixture<SignatureUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let signatureService: SignatureService;
    let signatureValidationService: SignatureValidationService;
    let userService: UserService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [SignatureUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(SignatureUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(SignatureUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      signatureService = TestBed.inject(SignatureService);
      signatureValidationService = TestBed.inject(SignatureValidationService);
      userService = TestBed.inject(UserService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call signatureValidation query and add missing value', () => {
        const signature: ISignature = { id: 456 };
        const signatureValidation: ISignatureValidation = { id: 26318 };
        signature.signatureValidation = signatureValidation;

        const signatureValidationCollection: ISignatureValidation[] = [{ id: 17766 }];
        spyOn(signatureValidationService, 'query').and.returnValue(of(new HttpResponse({ body: signatureValidationCollection })));
        const expectedCollection: ISignatureValidation[] = [signatureValidation, ...signatureValidationCollection];
        spyOn(signatureValidationService, 'addSignatureValidationToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ signature });
        comp.ngOnInit();

        expect(signatureValidationService.query).toHaveBeenCalled();
        expect(signatureValidationService.addSignatureValidationToCollectionIfMissing).toHaveBeenCalledWith(
          signatureValidationCollection,
          signatureValidation
        );
        expect(comp.signatureValidationsCollection).toEqual(expectedCollection);
      });

      it('Should call User query and add missing value', () => {
        const signature: ISignature = { id: 456 };
        const owner: IUser = { id: 'RSS' };
        signature.owner = owner;

        const userCollection: IUser[] = [{ id: 'Investment' }];
        spyOn(userService, 'query').and.returnValue(of(new HttpResponse({ body: userCollection })));
        const additionalUsers = [owner];
        const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
        spyOn(userService, 'addUserToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ signature });
        comp.ngOnInit();

        expect(userService.query).toHaveBeenCalled();
        expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(userCollection, ...additionalUsers);
        expect(comp.usersSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const signature: ISignature = { id: 456 };
        const signatureValidation: ISignatureValidation = { id: 4196 };
        signature.signatureValidation = signatureValidation;
        const owner: IUser = { id: 'Honduras initiatives SSL' };
        signature.owner = owner;

        activatedRoute.data = of({ signature });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(signature));
        expect(comp.signatureValidationsCollection).toContain(signatureValidation);
        expect(comp.usersSharedCollection).toContain(owner);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const signature = { id: 123 };
        spyOn(signatureService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ signature });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: signature }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(signatureService.update).toHaveBeenCalledWith(signature);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const signature = new Signature();
        spyOn(signatureService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ signature });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: signature }));
        saveSubject.complete();

        // THEN
        expect(signatureService.create).toHaveBeenCalledWith(signature);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const signature = { id: 123 };
        spyOn(signatureService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ signature });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(signatureService.update).toHaveBeenCalledWith(signature);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackSignatureValidationById', () => {
        it('Should return tracked SignatureValidation primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackSignatureValidationById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });

      describe('trackUserById', () => {
        it('Should return tracked User primary key', () => {
          const entity = { id: 'ABC' };
          const trackResult = comp.trackUserById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
