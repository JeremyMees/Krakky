import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingComponent } from './component/landing.component';
import { StylingModule } from '../styling/styling.module';

@NgModule({
  declarations: [LandingComponent],
  imports: [CommonModule, StylingModule],
})
export class LandingModule {}
