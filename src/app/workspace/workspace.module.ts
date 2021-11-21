import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkspaceComponent } from './components/workspace-parent/workspace.component';
import { StylingModule } from '../styling/styling.module';
import { WorkspaceListComponent } from './components/workspace-list/workspace-list.component';
import { WorkspaceSingleComponent } from './components/workspace-single/workspace-single.component';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { CreateWorkspaceComponent } from './modals/create-workspace/create-workspace.component';
@NgModule({
  declarations: [
    WorkspaceComponent,
    WorkspaceListComponent,
    WorkspaceSingleComponent,
    CreateWorkspaceComponent,
  ],
  imports: [CommonModule, StylingModule, FormsModule, SharedModule],
})
export class WorkspaceModule {}
