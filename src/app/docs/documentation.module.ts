import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParentComponent } from './components/parent/parent.component';
import { DocCardComponent } from './components/doc-card/doc-card.component';
import { StylingModule } from '../styling/styling.module';
import { DocListComponent } from './components/doc-list/doc-list.component';
import { DocDashboardComponent } from './components/doc-dashboard/doc-dashboard.component';
import { FooterModule } from '../footer/footer.module';
import { DocUserComponent } from './components/doc-user/doc-user.component';
import { DocOverviewComponent } from './components/doc-overview/doc-overview.component';

@NgModule({
  declarations: [
    ParentComponent,
    DocCardComponent,
    DocListComponent,
    DocDashboardComponent,
    DocUserComponent,
    DocOverviewComponent,
  ],
  exports: [
    ParentComponent,
    DocCardComponent,
    DocListComponent,
    DocDashboardComponent,
    DocUserComponent,
    DocOverviewComponent,
  ],
  imports: [CommonModule, StylingModule, FooterModule],
})
export class DocumentationModule {}
