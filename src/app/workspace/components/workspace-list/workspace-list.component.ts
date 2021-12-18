import { Component, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { Dashboard } from 'src/app/dashboard/models/dashboard.model';
import { DeleteComponent } from 'src/app/shared/modals/delete/delete.component';
import { User } from 'src/app/user/models/user.model';
import { CreateWorkspaceComponent } from '../../modals/create-workspace/create-workspace.component';
import { AggregatedWorkspace } from '../../models/aggregated-workspace.model';
import { WorkspaceService } from '../../services/workspace.service';

@Component({
  selector: 'app-workspace-list',
  templateUrl: './workspace-list.component.html',
  styleUrls: ['./workspace-list.component.scss'],
  providers: [MessageService],
})
export class WorkspaceListComponent {
  selected_workspace: AggregatedWorkspace | null = null;
  editWorkspace: boolean = false;
  @Input() workspaces: Array<AggregatedWorkspace> = [];
  current_user: User | null = null;
  current_user_sub$: Subscription = new Subscription();
  selected_dashboard: Dashboard | undefined;

  constructor(
    public dialog: MatDialog,
    private messageService: MessageService,
    private workspaceService: WorkspaceService,
    public router: Router
  ) {}

  private _onDeleteWorkspace(workspace: AggregatedWorkspace): void {
    const dialogRef = this.dialog.open(DeleteComponent, {
      data: { name: workspace.workspace, title: 'workspace' },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.workspaceService
          .deleteWorkspace(workspace.workspace_id)
          .subscribe({
            next: () => {
              const removeIndex: number = this.workspaces.findIndex(
                (item) =>
                  item.workspace_id === this.selected_workspace?.workspace_id
              );
              this.workspaces.splice(removeIndex, 1);
              this._showSnackbar(
                'success',
                `Deleted ${this.selected_workspace?.workspace} succesfully`
              );
            },
            error: () => {
              this._showSnackbar('error', 'Error while deleting workspace');
            },
          });
      }
    });
  }

  public onAddWorkspace(): void {
    const dialogRef = this.dialog.open(CreateWorkspaceComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (result.statusCode === 201) {
          result.data.dashboards = [];
          this.workspaces.push(result.data);
        } else {
          this._showSnackbar('error', "Couldn't save new workspace");
        }
      }
    });
  }

  public onSaveWorkspaceTitle(
    form: NgForm,
    workspace: AggregatedWorkspace
  ): void {
    if (form.invalid) {
      form.reset();
      return;
    }
    workspace.workspace = form.value.workspace_name;
    const { dashboards, ...payload } = workspace;
    this.workspaceService.updateWorkspace(payload).subscribe({
      next: () => {
        const updateIndex: number = this.workspaces.findIndex(
          (item) => item.workspace_id === workspace.workspace_id
        );
        this.workspaces[updateIndex].workspace = form.value.workspace_name;
      },
      error: () => {
        this._showSnackbar('error', 'Error while updating workspace');
      },
    });
  }

  private _showSnackbar(severity: string, detail: string): void {
    this.messageService.add({
      severity,
      detail,
    });
  }

  public navigateToDashboard(id: string): void {
    this.router.navigateByUrl(`dashboard/${id}`);
  }

  items: Array<MenuItem> = [
    {
      label: 'Delete workspace',
      icon: 'pi pi-fw pi-trash',
      command: () => {
        this._onDeleteWorkspace(this.selected_workspace as AggregatedWorkspace);
      },
    },
  ];
}
