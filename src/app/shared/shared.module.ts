import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeleteComponent } from './modals/delete/delete.component';
import { FormsModule } from '@angular/forms';
import { StylingModule } from '../styling/styling.module';
import { TermsComponent } from './modals/terms/terms.component';
import { PrivacyComponent } from './modals/privacy/privacy.component';

@NgModule({
  declarations: [DeleteComponent, TermsComponent, PrivacyComponent],
  exports: [DeleteComponent, TermsComponent, PrivacyComponent],
  imports: [CommonModule, StylingModule, FormsModule],
})
export class SharedModule {}
