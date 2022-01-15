import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotMemberComponent } from './component/not-member.component';
import { StylingModule } from '../styling/styling.module';

@NgModule({
  declarations: [NotMemberComponent],
  imports: [CommonModule, StylingModule],
})
export class NotMemberModule {}
