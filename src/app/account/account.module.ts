import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountComponent } from './component/account.component';
import { StylingModule } from '../styling/styling.module';

@NgModule({
  declarations: [AccountComponent],
  imports: [CommonModule, StylingModule],
})
export class AccountModule {}
