import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { JhipsterSampleApplicationTestModule } from '../../../test.module';
import { LinkUpdateComponent } from 'app/entities/link/link-update.component';
import { LinkService } from 'app/entities/link/link.service';
import { Link } from 'app/shared/model/link.model';

describe('Component Tests', () => {
  describe('Link Management Update Component', () => {
    let comp: LinkUpdateComponent;
    let fixture: ComponentFixture<LinkUpdateComponent>;
    let service: LinkService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [JhipsterSampleApplicationTestModule],
        declarations: [LinkUpdateComponent],
        providers: [FormBuilder],
      })
        .overrideTemplate(LinkUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(LinkUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(LinkService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new Link(123);
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
        const entity = new Link();
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
