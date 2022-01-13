import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountComponent } from './components/account/account.component';
import { StylingModule } from '../styling/styling.module';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { CharacterComponent } from './components/character/character.component';
@NgModule({
  declarations: [AccountComponent, CharacterComponent],
  imports: [CommonModule, StylingModule, ClipboardModule],
})
export class AccountModule {}
