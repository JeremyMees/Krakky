import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './components/dashboard.component';
import { StylingModule } from '../styling/styling.module';
import { SharedModule } from '../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { DashboardService } from './service/dashboard.service';
import { CardModule } from '../card/card.module';
import { DashboardMembersComponent } from './modals/dashboard-members/dashboard-members.component';

@NgModule({
  declarations: [DashboardComponent, DashboardMembersComponent],
  imports: [CommonModule, StylingModule, FormsModule, SharedModule, CardModule],
  providers: [DashboardService],
})
export class DashboardModule {}