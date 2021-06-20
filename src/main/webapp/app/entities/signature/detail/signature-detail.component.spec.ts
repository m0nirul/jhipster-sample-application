import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { SignatureDetailComponent } from './signature-detail.component';

describe('Component Tests', () => {
  describe('Signature Management Detail Component', () => {
    let comp: SignatureDetailComponent;
    let fixture: ComponentFixture<SignatureDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [SignatureDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ signature: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(SignatureDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(SignatureDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load signature on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.signature).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
