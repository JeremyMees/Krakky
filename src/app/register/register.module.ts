import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterComponent } from './components/register/register.component';
import { StylingModule } from '../styling/styling.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [RegisterComponent],
  imports: [CommonModule, StylingModule, ReactiveFormsModule, SharedModule],
})
export class RegisterModule {}
