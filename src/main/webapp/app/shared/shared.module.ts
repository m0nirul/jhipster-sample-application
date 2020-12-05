import { NgModule } from '@angular/core';
import { JhipsterSampleApplicationSharedLibsModule } from './shared-libs.module';
import { AlertComponent } from './alert/alert.component';
import { AlertErrorComponent } from './alert/alert-error.component';
import { HasAnyAuthorityDirective } from './auth/has-any-authority.directive';

@NgModule({
  imports: [JhipsterSampleApplicationSharedLibsModule],
  declarations: [AlertComponent, AlertErrorComponent, HasAnyAuthorityDirective],
  exports: [JhipsterSampleApplicationSharedLibsModule, AlertComponent, AlertErrorComponent, HasAnyAuthorityDirective],
})
export class JhipsterSampleApplicationSharedModule {}
