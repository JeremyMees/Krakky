import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AddDashboard } from 'src/app/dashboard/models/add-dashboard.model';
import { Dashboard } from 'src/app/dashboard/models/dashboard.model';
import { DashboardService } from 'src/app/dashboard/service/dashboard.service';
import { DeleteDialog } from 'src/app/shared/dialogs/delete/delete.component';
import { HttpResponse } from 'src/app/shared/models/http-response.model';
import { RandomColors } from 'src/app/shared/models/random-colors.model';
import { SharedService } from 'src/app/shared/services/shared.service';
import { TeamService } from 'src/app/team/services/team.service';
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
  workspaceForm!: FormGroup;
  dashboardForm!: FormGroup;

  constructor(
    public router: Router,
    public dialog: MatDialog,
    private messageService: MessageService,
    private workspaceService: WorkspaceService,
    private dashboardService: DashboardService,
    private userService: UserService,
    private sharedService: SharedService,
    private formBuilder: FormBuilder,
    private teamService: TeamService
  ) {}

  public ngOnInit(): void {
    this.userService
      .onGetCurrentUser()
      .pipe(takeUntil(this.destroy$))
      .subscribe((user) => {
        this.current_user = user;
        this._onFilterDashboardMember();
      });
    this.onSetFormWorkspace();
    this.onSetFormDashboard();
  }

  public ngOnDestroy(): void {
    this.destroy$.next(true);
  }

  public onSaveDashboard(form: FormGroup): void {
    if (!this._onCheckIfAdmin()) {
      this._onIsNotAdminOrOwner('admins');
      return;
    }
    if (form.invalid) {
      this._showSnackbar('error', "Form wasn't filled correctly");
      form.reset();
      return;
    }
    const dashboard: AddDashboard = {
      title: form.value.title,
      workspace_id: this.workspace.workspace_id,
      created_by: this.current_user?._id as string,
      private: form.value.private ? form.value.private : false,
      inactive: false,
      team: this._onGetMembers(form.value.private),
      color: this.sharedService.onGenerateOppositeColor(form.value.color),
      bg_color: form.value.color,
      recent_tags: [],
    };
    this.dashboardService.onAddDashboard(dashboard).subscribe({
      next: (res: HttpResponse) => {
        this.workspace.dashboards.push(res.data);
        this._onFilterDashboardMember();
      },
      error: () => {
        this._showSnackbar('error', 'Error while adding dashboard');
      },
    });
  }

  private _onGetMembers(private_dashboard: boolean): Array<Member> {
    let team: Array<Member> = [];
    if (!private_dashboard) {
      this.workspace.team.forEach((member: Member) => {
        member._id !== this.current_user!._id
          ? team.push({ _id: member._id, role: 'Member' })
          : team.push({ _id: this.current_user!._id as string, role: 'Admin' });
      });
    } else {
      team.push({ _id: this.current_user!._id as string, role: 'Admin' });
    }
    return team;
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
    if (form.invalid) {
      this._showSnackbar('error', "Form wasn't filled correctly");
      form.reset();
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
    this.workspaceService.onUpdateWorkspace(payload).subscribe({
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
    const dialogRef = this.dialog.open(DeleteDialog, {
      data: { name: this.selected_dashboard?.title, title: 'dashboard' },
    });
    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.dashboardService
          .onDeleteDashboard(id)
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

  public onSetFormWorkspace(): void {
    this.workspaceForm = this.formBuilder.group({
      color: [this.workspace.bg_color],
      title: [
        this.workspace.workspace,
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(20),
        ],
      ],
    });
  }

  public onSetFormDashboard(): void {
    const random_colors: RandomColors =
      this.sharedService.onGenerateRandomColors();
    this.dashboardForm = this.formBuilder.group({
      private: [false],
      color: [random_colors.bg_color, [Validators.required]],
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
    const dialogRef = this.dialog.open(DeleteDialog, {
      data: { name: this.workspace.workspace, title: 'workspace' },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.workspaceService
          .onDeleteWorkspace(this.workspace.workspace_id)
          .subscribe({
            next: () => {
              this._showSnackbar(
                'success',
                `Deleted ${this.workspace?.workspace} successfully`
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

  private _onLeaveWorkspace(): void {
    if (!this._onCheckIfMultipleOwners() && this._onCheckIfOwner()) {
      this._showSnackbar(
        'info',
        `You are the only owner and can't leave the workspace, make someone else owner or delete the workspace`
      );
      return;
    }
    this.teamService
      .deleteMember(
        this.workspace.workspace_id,
        this.current_user!._id as string
      )
      .subscribe({
        next: () => {
          this.router.navigateByUrl('workspace');
        },
        error: () => {
          this._showSnackbar('error', "Could't leave workspace");
        },
      });
  }

  private _onCheckIfMultipleOwners(): boolean {
    let owners: Array<Member> = [];
    this.workspace.team.forEach((member: Member) => {
      if (member.role === 'Owner') {
        owners.push(member);
      }
    });
    return owners.length < 2 ? false : true;
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
    {
      label: 'Leave workspace',
      icon: 'pi pi-fw pi-sign-out',
      command: () => {
        this._onLeaveWorkspace();
      },
    },
  ];
}
