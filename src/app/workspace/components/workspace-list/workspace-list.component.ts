import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MenuItem, MessageService } from 'primeng/api';
import { OverlayPanel } from 'primeng/overlaypanel';
import { DeleteComponent } from 'src/app/shared/modals/delete/delete.component';
import { CreateWorkspaceComponent } from '../../modals/create-workspace/create-workspace.component';
import { AggregatedWorkspace } from '../../models/aggregated-workspace.model';
import { WorkspaceService } from '../../services/workspace.service';

@Component({
  selector: 'app-workspace-list',
  templateUrl: './workspace-list.component.html',
  styleUrls: ['./workspace-list.component.scss'],
  providers: [MessageService],
})
export class WorkspaceListComponent implements OnInit {
  selected_workspace: AggregatedWorkspace | null = null;
  editWorkspace: boolean = false;
  @Input() workspaces: Array<AggregatedWorkspace> = [];
  @ViewChild('opw') opw!: OverlayPanel;

  constructor(
    public dialog: MatDialog,
    private messageService: MessageService,
    private workspaceService: WorkspaceService
  ) {}

  public ngOnInit(): void {}

  private _onDeleteWorkspace(workspace: AggregatedWorkspace): void {
    const dialogRefLogin = this.dialog.open(DeleteComponent, {
      data: { workspace: workspace.workspace, title: 'workspace' },
    });
    dialogRefLogin.afterClosed().subscribe((result) => {
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
            error: (err) => {
              console.log(err);
              this._showSnackbar('error', 'Error while deleting workspace');
            },
          });
      }
    });
  }

  public onAddWorkspace(): void {
    const dialogRefLogin = this.dialog.open(CreateWorkspaceComponent);
    dialogRefLogin.afterClosed().subscribe((result) => {
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
        this.opw.hide();
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
