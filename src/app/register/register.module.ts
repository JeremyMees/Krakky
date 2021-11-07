import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterComponent } from './component/register.component';
import { StylingModule } from '../styling/styling.module';

@NgModule({
  declarations: [RegisterComponent],
  imports: [CommonModule, StylingModule],
})
export class RegisterModule {}
