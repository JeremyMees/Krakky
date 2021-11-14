import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingComponent } from './components/landing.component';
import { StylingModule } from '../styling/styling.module';

@NgModule({
  declarations: [LandingComponent],
  imports: [CommonModule, StylingModule],
})
export class LandingModule {}
