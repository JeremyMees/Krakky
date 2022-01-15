import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AddDashboard } from 'src/app/dashboard/models/add-dashboard.model';
import { Dashboard } from 'src/app/dashboard/models/dashboard.model';
import { DashboardService } from 'src/app/dashboard/service/dashboard.service';
import { DeleteComponent } from 'src/app/shared/modals/delete/delete.component';
import { HttpResponse } from 'src/app/shared/models/http-response.model';
import { SharedService } from 'src/app/shared/services/shared.service';
import { User } from 'src/app/user/models/user.model';
import { UserService } from 'src/app/user/services/user.service';
import { AggregatedWorkspace } from '../../models/aggregated-workspace.model';
import { Member } from '../../models/member.model';
import { WorkspaceService } from '../../services/workspace.service';

@Component({
  selector: 'app-workspace-single',
  templateUrl: './workspace-single.component.html',
  styleUrls: ['./workspace-single.component.scss'],
  providers: [MessageService],
})
export class WorkspaceSingleComponent implements OnInit, OnDestroy {
  @Input() workspace!: AggregatedWorkspace;
  current_user: User | null = null;
  current_user_sub$: Subscription = new Subscription();
  selected_dashboard: Dashboard | undefined;
  dashboards: Array<Dashboard> = [];
  destroy$: Subject<boolean> = new Subject();
  updateWorkspaceForm!: FormGroup;

  constructor(
    public router: Router,
    public dialog: MatDialog,
    private messageService: MessageService,
    private workspaceService: WorkspaceService,
    private dashboardService: DashboardService,
    private userService: UserService,
    private sharedService: SharedService
  ) {}

  public ngOnInit(): void {
    this.userService
      .getCurrentUser()
      .pipe(takeUntil(this.destroy$))
      .subscribe((user) => {
        this.current_user = user;
        this._onFilterDashboardMember();
      });
    this.onSetForm();
  }

  public ngOnDestroy(): void {
    this.destroy$.next(true);
  }

  public onSaveDashboard(form: NgForm): void {
    if (!this._onCheckIfAdmin()) {
      this._onIsNotAdminOrOwner('admins');
      return;
    }
    if (form.invalid) {
      form.reset();
      return;
    }
    const dashboard: AddDashboard = {
      title: form.value.dashboard_name,
      workspace_id: this.workspace.workspace_id,
      created_by: this.current_user?._id as string,
      private: form.value.private ? form.value.private : false,
      inactive: false,
      team: [{ _id: this.current_user!._id as string, role: 'Admin' }],
    };
    this.dashboardService.addDashboard(dashboard).subscribe({
      next: (res: HttpResponse) => {
        this.workspace.dashboards.push(res.data);
        this._onFilterDashboardMember();
      },
      error: () => {
        this._showSnackbar('error', 'Error while adding dashboard');
      },
    });
  }

  private _onFilterDashboardMember(): void {
    this.dashboards = [];
    this.workspace.dashboards.forEach((dashboard: Dashboard) => {
      if (dashboard.private) {
        dashboard.team.forEach((member: Member) => {
          if (member._id === (this.current_user?._id as string)) {
            this.dashboards.push(dashboard);
          }
        });
      } else {
        this.dashboards.push(dashboard);
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
      .workspace as AggregatedWorkspace;
    workspace.bg_color = form.value.color;
    workspace.color = opposite_color;
    workspace.workspace = form.value.title;
    const { dashboards, ...payload } = workspace!;
    this.workspaceService.updateWorkspace(payload).subscribe({
      next: () => {
        this.workspace = workspace;
      },
      error: () => {
        this._showSnackbar('error', 'Error while updating workspace');
      },
    });
  }

  public onDeleteDashboard(id: string): void {
    if (!this._onCheckIfAdmin()) {
      this._onIsNotAdminOrOwner('admins');
      return;
    }
    const dialogRef = this.dialog.open(DeleteComponent, {
      data: { name: this.selected_dashboard?.title, title: 'dashboard' },
    });
    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.dashboardService
          .deleteDashboard(id)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              const dashboards: Array<Dashboard> =
                this.workspace.dashboards.filter(
                  (dashboard: Dashboard) => dashboard.board_id !== id
                );
              this.workspace.dashboards = dashboards;
              this._onFilterDashboardMember();
            },
            error: () => {
              this._showSnackbar('error', 'Error while updating workspace');
            },
          });
      }
    });
  }

  private _onCheckIfAdmin(): boolean {
    const user: Member = this.workspace.team.filter(
      (member: Member) => member._id === this.current_user!._id
    )[0];
    if (user) {
      return user.role === 'Owner' || user.role === 'Admin' ? true : false;
    } else {
      return false;
    }
  }

  private _onCheckIfOwner(): boolean {
    if (this.workspace) {
      const user: Member = this.workspace.team.filter(
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

  private _onIsNotAdminOrOwner(what: string): void {
    this._showSnackbar('info', `That action is only for ${what}`);
  }

  public onSetForm(): void {
    this.updateWorkspaceForm = new FormGroup({
      color: new FormControl(this.workspace.bg_color),
      title: new FormControl(this.workspace.workspace),
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

  private _onDeleteWorkspace(): void {
    if (!this._onCheckIfOwner()) {
      this._onIsNotAdminOrOwner('owners');
      return;
    }
    const dialogRef = this.dialog.open(DeleteComponent, {
      data: { name: this.workspace.workspace, title: 'workspace' },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.workspaceService
          .deleteWorkspace(this.workspace.workspace_id)
          .subscribe({
            next: () => {
              this._showSnackbar(
                'success',
                `Deleted ${this.workspace?.workspace} succesfully`
              );
              this.router.navigateByUrl('workspace');
            },
            error: () => {
              this._showSnackbar('error', 'Error while deleting workspace');
            },
          });
      }
    });
  }

  items: Array<MenuItem> = [
    {
      label: 'Dashboard',
      icon: 'pi pi-fw pi-table',
      command: () => {
        this.router.navigateByUrl(
          `dashboard/${this.selected_dashboard?.board_id}`
        );
      },
    },
    {
      label: 'Statistics',
      icon: 'pi pi-fw pi-chart-line',
      command: () => {
        this.router.navigateByUrl(
          `dashboard/statistics/${this.selected_dashboard?.board_id}`
        );
      },
    },
    {
      label: 'Delete dashboard',
      icon: 'pi pi-fw pi-trash',
      command: () => {
        this.onDeleteDashboard(this.selected_dashboard?.board_id as string);
      },
    },
  ];

  items_workspace: Array<MenuItem> = [
    {
      label: 'Delete workspace',
      icon: 'pi pi-fw pi-trash',
      command: () => {
        this._onDeleteWorkspace();
      },
    },
  ];
}
