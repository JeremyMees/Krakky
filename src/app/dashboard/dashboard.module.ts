import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { StylingModule } from '../styling/styling.module';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DashboardService } from './service/dashboard.service';
import { CardModule } from '../card/card.module';
import { DashboardMembersDialog } from './dialogs/dashboard-members/dashboard-members.component';
import { StatisticsComponent } from './components/statistics/statistics.component';

@NgModule({
  declarations: [
    DashboardComponent,
    DashboardMembersDialog,
    StatisticsComponent,
  ],
  imports: [
    CommonModule,
    StylingModule,
    ReactiveFormsModule,
    SharedModule,
    CardModule,
    FormsModule,
  ],
  providers: [DashboardService],
})
export class DashboardModule {}
