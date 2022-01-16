import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountComponent } from './components/account/account.component';
import { StylingModule } from '../styling/styling.module';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { CharacterComponent } from './modals/character/character.component';
import { FooterModule } from '../footer/footer.module';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditAccountComponent } from './modals/edit-account/edit-account.component';
@NgModule({
  declarations: [AccountComponent, CharacterComponent, EditAccountComponent],
  imports: [
    CommonModule,
    StylingModule,
    ClipboardModule,
    FooterModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class AccountModule {}
