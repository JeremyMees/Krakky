import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeleteComponent } from './modals/delete/delete.component';
import { FormsModule } from '@angular/forms';
import { StylingModule } from '../styling/styling.module';

@NgModule({
  declarations: [DeleteComponent],
  exports: [DeleteComponent],
  imports: [CommonModule, StylingModule, FormsModule],
})
export class SharedModule {}
