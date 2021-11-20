import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeamComponent } from './components/team.component';
import { StylingModule } from '../styling/styling.module';
import { SharedModule } from '../shared/shared.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [TeamComponent],
  imports: [CommonModule, StylingModule, SharedModule, FormsModule],
})
export class TeamModule {}
