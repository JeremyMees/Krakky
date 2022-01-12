import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingComponent } from './components/landing/landing.component';
import { StylingModule } from '../styling/styling.module';
import { FooterModule } from '../footer/footer.module';

@NgModule({
  declarations: [LandingComponent],
  imports: [CommonModule, StylingModule, FooterModule],
})
export class LandingModule {}
