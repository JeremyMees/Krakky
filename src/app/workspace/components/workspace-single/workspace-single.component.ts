import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { AddDashboard } from 'src/app/dashboard/models/add-dashboard.model';
import { Dashboard } from 'src/app/dashboard/models/dashboard.model';
import { DashboardService } from 'src/app/dashboard/service/dashboard.service';
import { DeleteComponent } from 'src/app/shared/modals/delete/delete.component';
import { HttpResponse } from 'src/app/shared/models/http-response.model';
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

  constructor(
    public router: Router,
    public dialog: MatDialog,
    private messageService: MessageService,
    private workspaceService: WorkspaceService,
    private dashboardService: DashboardService,
    private userService: UserService
  ) {}

  public ngOnInit(): void {
    this.current_user_sub$ = this.userService
      .getCurrentUser()
      .subscribe((user) => {
        this.current_user = user;
        this.workspace.dashboards.forEach((dashboard: Dashboard) => {
          dashboard.team.forEach((member: Member) => {
            if (member._id === (this.current_user?._id as string)) {
              this.dashboards.push(dashboard);
            }
          });
        });
      });
  }

  public ngOnDestroy(): void {
    this.current_user_sub$.unsubscribe();
  }

  public onSaveDashboard(form: NgForm): void {
    if (form.invalid) {
      form.reset();
      return;
    }
    const dashboard: AddDashboard = {
      title: form.value.dashboard_name,
      workspace_id: this.workspace.workspace_id,
      created_by: this.current_user?._id as string,
    };
    this.dashboardService.addDashboard(dashboard).subscribe({
      next: (res: HttpResponse) => {
        this.workspace.dashboards.push(res.data);
      },
      error: (err) => {
        console.log(err);
        this._showSnackbar('error', 'Error while adding dashboard');
      },
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
        this.workspace.workspace = form.value.workspace_name;
      },
      error: () => {
        this._showSnackbar('error', 'Error while updating workspace');
      },
    });
  }

  public onDeleteDashboard(id: string): void {
    const dialogRef = this.dialog.open(DeleteComponent, {
      data: { name: this.selected_dashboard?.title, title: 'dashboard' },
    });
    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.dashboardService.deleteDashboard(id).subscribe({
          next: () => {
            const index: number = this.workspace.dashboards.findIndex(
              (dashboard: Dashboard) => dashboard.board_id === id
            );
            this.workspace.dashboards.splice(index, 1);
          },
          error: () => {
            this._showSnackbar('error', 'Error while updating workspace');
          },
        });
      }
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
      command: () => {},
    },
    {
      label: 'Delete dashboard',
      icon: 'pi pi-fw pi-trash',
      command: () => {
        this.onDeleteDashboard(this.selected_dashboard?.board_id as string);
      },
    },
  ];
}
