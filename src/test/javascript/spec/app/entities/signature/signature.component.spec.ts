import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { JhipsterSampleApplicationTestModule } from '../../../test.module';
import { SignatureComponent } from 'app/entities/signature/signature.component';
import { SignatureService } from 'app/entities/signature/signature.service';
import { Signature } from 'app/shared/model/signature.model';

describe('Component Tests', () => {
  describe('Signature Management Component', () => {
    let comp: SignatureComponent;
    let fixture: ComponentFixture<SignatureComponent>;
    let service: SignatureService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [JhipsterSampleApplicationTestModule],
        declarations: [SignatureComponent],
      })
        .overrideTemplate(SignatureComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(SignatureComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(SignatureService);
    });

    it('Should call load all on init', () => {
      // GIVEN
      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new Signature(123)],
            headers,
          })
        )
      );

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.signatures && comp.signatures[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
