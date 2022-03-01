import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoffeeComponent } from './components/coffee/coffee.component';
import { StylingModule } from '../styling/styling.module';

@NgModule({
  declarations: [CoffeeComponent],
  exports: [CoffeeComponent],
  imports: [CommonModule, StylingModule],
})
export class CoffeeModule {}
