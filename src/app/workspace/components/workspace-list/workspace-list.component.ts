import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Dashboard } from 'src/app/dashboard/models/dashboard.model';
import { DeleteComponent } from 'src/app/shared/modals/delete/delete.component';
import { SharedService } from 'src/app/shared/services/shared.service';
import { User } from 'src/app/user/models/user.model';
import { UserService } from 'src/app/user/services/user.service';
import { CreateWorkspaceComponent } from '../../modals/create-workspace/create-workspace.component';
import { AggregatedWorkspace } from '../../models/aggregated-workspace.model';
import { Member } from '../../models/member.model';
import { WorkspaceService } from '../../services/workspace.service';

@Component({
  selector: 'app-workspace-list',
  templateUrl: './workspace-list.component.html',
  styleUrls: ['./workspace-list.component.scss'],
  providers: [MessageService],
})
export class WorkspaceListComponent implements OnInit, OnDestroy {
  @Input() workspaces: Array<AggregatedWorkspace> = [];
  selected_workspace: AggregatedWorkspace | null = null;
  editWorkspace: boolean = false;
  current_user: User | null = null;
  current_user_sub$: Subscription = new Subscription();
  selected_dashboard: Dashboard | undefined;
  destroy$: Subject<boolean> = new Subject();
  workspaceForm!: FormGroup;

  constructor(
    public dialog: MatDialog,
    private messageService: MessageService,
    private workspaceService: WorkspaceService,
    public router: Router,
    private userService: UserService,
    private sharedService: SharedService,
    private formBuilder: FormBuilder
  ) {}

  public ngOnInit(): void {
    this.userService
      .getCurrentUser()
      .pipe(takeUntil(this.destroy$))
      .subscribe((user) => {
        this.current_user = user;
      });
    this.onSetForm();
  }

  public ngOnDestroy(): void {
    this.destroy$.next(true);
  }

  private _onDeleteWorkspace(workspace: AggregatedWorkspace): void {
    if (!this._onCheckIfOwner()) {
      this._onIsNotAdminOrOwner('owners');
      return;
    }
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

  public onSaveWorkspaceTitle(form: FormGroup): void {
    if (!this._onCheckIfAdmin()) {
      this._onIsNotAdminOrOwner('admins');
      return;
    }
    const opposite_color: string = this.sharedService.onGenerateOppositeColor(
      form.value.color
    );
    const workspace: AggregatedWorkspace = this
      .selected_workspace as AggregatedWorkspace;
    workspace.bg_color = form.value.color;
    workspace.color = opposite_color;
    workspace.workspace = form.value.title;
    const { dashboards, ...payload } = workspace!;
    this.workspaceService.updateWorkspace(payload).subscribe({
      next: () => {
        const updateIndex: number = this.workspaces.findIndex(
          (item) => item.workspace_id === this.selected_workspace!.workspace_id
        );
        this.workspaces[updateIndex] = workspace;
        this.selected_workspace = workspace;
      },
      error: () => {
        this._showSnackbar('error', 'Error while updating workspace');
      },
    });
  }

  private _onCheckIfOwner(): boolean {
    if (this.selected_workspace) {
      const user: Member = this.selected_workspace.team.filter(
        (member: Member) => member._id === this.current_user!._id
      )[0];
      if (user) {
        return user.role === 'Owner' ? true : false;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  private _onCheckIfAdmin(): boolean {
    if (this.selected_workspace) {
      const user: Member = this.selected_workspace.team.filter(
        (member: Member) => member._id === this.current_user!._id
      )[0];
      if (user) {
        return user.role === 'Owner' || user.role === 'Admin' ? true : false;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  private _onIsNotAdminOrOwner(role: string): void {
    this._showSnackbar('info', `That action is only for ${role}`);
  }

  public onFilterDashboardMember(
    dashboards: Array<Dashboard>
  ): Array<Dashboard> {
    const member_dashboards: Array<Dashboard> = [];
    dashboards.forEach((dashboard: Dashboard) => {
      if (dashboard.private) {
        dashboard.team.forEach((member: Member) => {
          if (member._id === (this.current_user?._id as string)) {
            member_dashboards.push(dashboard);
          }
        });
      } else {
        member_dashboards.push(dashboard);
      }
    });
    return member_dashboards;
  }

  public onSetForm(): void {
    if (this.selected_workspace) {
      this.workspaceForm = this.formBuilder.group({
        color: [this.selected_workspace.bg_color],
        title: [
          this.selected_workspace.workspace,
          [
            Validators.required,
            Validators.minLength(4),
            Validators.maxLength(20),
          ],
        ],
      });
    } else {
      this.workspaceForm = this.formBuilder.group({
        color: ['#ffffff'],
        title: [
          '',
          [
            Validators.required,
            Validators.minLength(4),
            Validators.maxLength(20),
          ],
        ],
      });
    }
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
