import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditCardComponent } from './components/edit-card/edit-card.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { StylingModule } from '../styling/styling.module';

@NgModule({
  declarations: [EditCardComponent],
  exports: [EditCardComponent],
  imports: [
    CommonModule,
    StylingModule,
    ReactiveFormsModule,
    SharedModule,
    FormsModule,
  ],
})
export class CardModule {}
