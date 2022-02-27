import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountComponent } from './components/account/account.component';
import { StylingModule } from '../styling/styling.module';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { CharacterDialog } from './dialogs/character/character.component';
import { FooterModule } from '../footer/footer.module';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditAccountDialog } from './dialogs/edit-account/edit-account.component';
import { DeleteAccountDialog } from './dialogs/delete-account/delete-account.component';
@NgModule({
  declarations: [
    AccountComponent,
    CharacterDialog,
    EditAccountDialog,
    DeleteAccountDialog,
  ],
  exports: [CharacterDialog],
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
