import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactComponent } from './components/contact/contact.component';
import { StylingModule } from '../styling/styling.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ClipboardModule } from '@angular/cdk/clipboard';

@NgModule({
  declarations: [ContactComponent],
  exports: [ContactComponent],
  imports: [CommonModule, StylingModule, ReactiveFormsModule, ClipboardModule],
})
export class ContactModule {}
