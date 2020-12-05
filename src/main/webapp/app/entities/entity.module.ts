import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'signature',
        loadChildren: () => import('./signature/signature.module').then(m => m.JhipsterSampleApplicationSignatureModule),
      },
      {
        path: 'signature-validation',
        loadChildren: () =>
          import('./signature-validation/signature-validation.module').then(m => m.JhipsterSampleApplicationSignatureValidationModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class JhipsterSampleApplicationEntityModule {}
