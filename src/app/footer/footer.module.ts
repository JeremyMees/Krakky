import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './components/footer/footer.component';
import { StylingModule } from '../styling/styling.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [FooterComponent],
  exports: [FooterComponent],
  imports: [CommonModule, StylingModule, SharedModule],
})
export class FooterModule {}
