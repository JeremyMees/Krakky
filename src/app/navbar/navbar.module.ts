import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './component/navbar.component';
import { StylingModule } from '../styling/styling.module';

@NgModule({
  declarations: [NavbarComponent],
  imports: [CommonModule, StylingModule],
  exports: [NavbarComponent],
})
export class NavbarModule {}
