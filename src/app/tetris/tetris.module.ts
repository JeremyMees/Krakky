import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TetrisComponent } from './components/tetris-canvas/tetris.component';

@NgModule({
  declarations: [TetrisComponent],
  exports: [TetrisComponent],
  imports: [CommonModule],
})
export class TetrisModule {}
