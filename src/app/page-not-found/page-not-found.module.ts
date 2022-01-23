import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { StylingModule } from '../styling/styling.module';
import { TetrisModule } from '../tetris/tetris.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [PageNotFoundComponent],
  imports: [CommonModule, StylingModule, TetrisModule, SharedModule],
})
export class PageNotFoundModule {}
