import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeleteDialog } from './dialogs/delete/delete.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StylingModule } from '../styling/styling.module';
import { TermsDialog } from './dialogs/terms/terms.component';
import { PrivacyDialog } from './dialogs/privacy/privacy.component';
import { AvatarComponent } from './components/avatar/avatar.component';
import { CharacterEditorDialog } from './dialogs/character-editor/character-editor.component';
import { TagComponent } from './components/tag/tag.component';

@NgModule({
  declarations: [
    DeleteDialog,
    TermsDialog,
    PrivacyDialog,
    AvatarComponent,
    CharacterEditorDialog,
    TagComponent,
  ],
  exports: [
    DeleteDialog,
    TermsDialog,
    PrivacyDialog,
    AvatarComponent,
    CharacterEditorDialog,
    TagComponent,
  ],
  imports: [CommonModule, StylingModule, FormsModule, ReactiveFormsModule],
})
export class SharedModule {}
