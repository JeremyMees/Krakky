import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkspaceComponent } from './components/workspace-parent/workspace.component';
import { StylingModule } from '../styling/styling.module';
import { WorkspaceListComponent } from './components/workspace-list/workspace-list.component';
import { WorkspaceSingleComponent } from './components/workspace-single/workspace-single.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { WorkspaceJoinMemberComponent } from './components/workspace-join-member/workspace-join-member.component';
@NgModule({
  declarations: [
    WorkspaceComponent,
    WorkspaceListComponent,
    WorkspaceSingleComponent,
    WorkspaceJoinMemberComponent,
  ],
  imports: [
    CommonModule,
    StylingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ],
})
export class WorkspaceModule {}
