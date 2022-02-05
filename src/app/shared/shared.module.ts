import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeleteComponent } from './modals/delete/delete.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StylingModule } from '../styling/styling.module';
import { TermsComponent } from './modals/terms/terms.component';
import { PrivacyComponent } from './modals/privacy/privacy.component';
import { AvatarComponent } from './components/avatar/avatar.component';
import { CharacterEditorComponent } from './modals/character-editor/character-editor.component';
import { TagComponent } from './components/tag/tag.component';

@NgModule({
  declarations: [
    DeleteComponent,
    TermsComponent,
    PrivacyComponent,
    AvatarComponent,
    CharacterEditorComponent,
    TagComponent,
  ],
  exports: [
    DeleteComponent,
    TermsComponent,
    PrivacyComponent,
    AvatarComponent,
    CharacterEditorComponent,
    TagComponent,
  ],
  imports: [CommonModule, StylingModule, FormsModule, ReactiveFormsModule],
})
export class SharedModule {}
