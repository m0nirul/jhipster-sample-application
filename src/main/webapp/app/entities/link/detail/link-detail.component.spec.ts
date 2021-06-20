import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { LinkDetailComponent } from './link-detail.component';

describe('Component Tests', () => {
  describe('Link Management Detail Component', () => {
    let comp: LinkDetailComponent;
    let fixture: ComponentFixture<LinkDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [LinkDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ link: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(LinkDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(LinkDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load link on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.link).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
