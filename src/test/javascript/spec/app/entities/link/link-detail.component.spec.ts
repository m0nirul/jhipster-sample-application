import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { JhipsterSampleApplicationTestModule } from '../../../test.module';
import { LinkDetailComponent } from 'app/entities/link/link-detail.component';
import { Link } from 'app/shared/model/link.model';

describe('Component Tests', () => {
  describe('Link Management Detail Component', () => {
    let comp: LinkDetailComponent;
    let fixture: ComponentFixture<LinkDetailComponent>;
    const route = ({ data: of({ link: new Link(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [JhipsterSampleApplicationTestModule],
        declarations: [LinkDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }],
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
