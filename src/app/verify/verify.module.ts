import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotVerifiedComponent } from './components/not-verified/not-verified.component';
import { StylingModule } from '../styling/styling.module';
import { VerifyUserComponent } from './components/verify-user/verify-user.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [NotVerifiedComponent, VerifyUserComponent],
  imports: [CommonModule, StylingModule, ReactiveFormsModule],
})
export class VerifyModule {}
