import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './components/dashboard.component';
import { StylingModule } from '../styling/styling.module';
import { SharedModule } from '../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { DashboardService } from './service/dashboard.service';

@NgModule({
  declarations: [DashboardComponent],
  imports: [CommonModule, StylingModule, FormsModule, SharedModule],
  providers: [DashboardService],
})
export class DashboardModule {}
