import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingComponent } from './components/landing/landing.component';
import { StylingModule } from '../styling/styling.module';
import { FooterModule } from '../footer/footer.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [LandingComponent],
  imports: [CommonModule, StylingModule, FooterModule, SharedModule],
})
export class LandingModule {}
