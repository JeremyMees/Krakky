import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './component/login.component';
import { StylingModule } from '../styling/styling.module';

@NgModule({
  declarations: [LoginComponent],
  imports: [CommonModule, StylingModule],
})
export class LoginModule {}
