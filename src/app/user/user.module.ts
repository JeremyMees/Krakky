import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeleteUserComponent } from './components/delete-user/delete-user.component';
import { StylingModule } from '../styling/styling.module';

@NgModule({
  declarations: [DeleteUserComponent],
  imports: [CommonModule, StylingModule],
})
export class UserModule {}
