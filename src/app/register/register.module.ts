import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterComponent } from './components/register/register.component';
import { StylingModule } from '../styling/styling.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { NgParticlesModule } from 'ng-particles';
@NgModule({
  declarations: [RegisterComponent],
  imports: [
    CommonModule,
    StylingModule,
    ReactiveFormsModule,
    SharedModule,
    NgParticlesModule,
  ],
})
export class RegisterModule {}
