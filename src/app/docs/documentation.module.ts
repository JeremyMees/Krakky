import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParentComponent } from './components/parent/parent.component';
import { DocCardComponent } from './components/doc-card/doc-card.component';
import { StylingModule } from '../styling/styling.module';

@NgModule({
  declarations: [ParentComponent, DocCardComponent],
  exports: [ParentComponent, DocCardComponent],
  imports: [CommonModule, StylingModule],
})
export class DocumentationModule {}
