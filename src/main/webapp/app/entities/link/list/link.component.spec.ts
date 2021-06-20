import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { LinkService } from '../service/link.service';

import { LinkComponent } from './link.component';

describe('Component Tests', () => {
  describe('Link Management Component', () => {
    let comp: LinkComponent;
    let fixture: ComponentFixture<LinkComponent>;
    let service: LinkService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [LinkComponent],
      })
        .overrideTemplate(LinkComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(LinkComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(LinkService);

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
      expect(comp.links?.[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
