import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeleteUserComponent } from './components/delete-user/delete-user.component';
import { StylingModule } from '../styling/styling.module';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [DeleteUserComponent, ResetPasswordComponent],
  imports: [CommonModule, StylingModule, ReactiveFormsModule],
})
export class UserModule {}
