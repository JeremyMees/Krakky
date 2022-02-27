import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Assignee } from 'src/app/card/models/assignee.model';
import { HttpResponse } from 'src/app/shared/models/http-response.model';
import { User } from 'src/app/user/models/user.model';
import { Member } from 'src/app/workspace/models/member.model';
import { Workspace } from 'src/app/workspace/models/workspace.model';
import { WorkspaceService } from 'src/app/workspace/services/workspace.service';
import { AggregatedDashboard } from '../../models/aggregated-dashboard.model';
import { SocketDashboardService } from '../../service/socket-dashboard.service';

@Component({
  selector: 'app-dashboard-members',
  templateUrl: './dashboard-members.component.html',
  styleUrls: ['./dashboard-members.component.scss'],
  providers: [MessageService, ConfirmationService],
})
export class DashboardMembersDialog implements OnInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject();
  workspace!: Workspace;
  workspace_members: Array<Assignee> = [];
  dashboard_members: Array<Assignee> = [];
  roles: Array<{ name: string }> = [{ name: 'Admin' }, { name: 'Member' }];
  selected_member: Assignee | undefined;
  loading: boolean = true;

  constructor(
    public dialogRef: MatDialogRef<DashboardMembersDialog>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      dashboard: AggregatedDashboard;
      user: User;
    },
    private messageService: MessageService,
    private socketDashboardService: SocketDashboardService,
    private confirmationService: ConfirmationService,
    private workspaceService: WorkspaceService
  ) {}

  public ngOnInit(): void {
    this._onGetWorkspace();
  }

  public ngOnDestroy(): void {
    this.destroy$.next(true);
  }

  private _onGetWorkspace(): void {
    this.workspaceService
      .onGetWorkspaces(this.data.dashboard.workspace_id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: HttpResponse) => {
        if (res) {
          this.workspace = res.data[0];
          this._onGetMembers(this.workspace);
        } else {
          this._showSnackbar('error', "Couldn't fetch workspace members");
        }
      });
  }

  private _onGetMembers(workspace: Workspace): void {
    this.workspaceService
      .onGetMembersInfo(workspace.team)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: HttpResponse) => {
          if (res.statusCode === 200) {
            this.workspace_members = res.data;
            this._onFilterDashboardMembers();
          } else {
            this._showSnackbar('error', "Could't find team members");
          }
          this.loading = false;
        },
      });
  }

  public onSetSelectedMember(member: Assignee): void {
    this.selected_member = member;
  }

  public onChangeRole(member: Assignee, role: string): void {
    if (this.data.dashboard.inactive) {
      this._onIsInactive();
      return;
    }
    if (this._onCheckIfAdmin()) {
      const index: number = this.workspace.team.findIndex(
        (team_member: Member) => team_member._id === member._id
      );
      const aggregated_index: number = this.workspace_members.findIndex(
        (team_member: Assignee) => team_member._id === member._id
      );
      this.workspace_members[index].role = role;
      this.data.dashboard.team[aggregated_index].role = role;
      this._onUpdateTeam();
    } else {
      this._onIsNotAdmin();
    }
  }

  public onAddDashboardMember(member: Assignee): void {
    if (this.data.dashboard.inactive) {
      this._onIsInactive();
      return;
    }
    if (this._onCheckIfAdmin()) {
      const already_members: Array<Member> = this.data.dashboard.team.filter(
        (already_member: Member) => already_member._id === member._id
      );
      if (already_members.length > 0) {
        this._showSnackbar('info', 'Member already joined dashboard');
      } else {
        this.data.dashboard.team.push({
          _id: member._id as string,
          role: 'Member',
        });
        this._onUpdateTeam();
      }
    } else {
      this._onIsNotAdmin();
    }
  }

  public onConfirmDeleteMember(event: Event, member: Assignee): void {
    if (this.data.dashboard.inactive) {
      this._onIsInactive();
      return;
    }
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure that you want to delete this member?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this._onDeleteDashboardMember(member);
      },
    });
  }

  public _onDeleteDashboardMember(member: Assignee): void {
    if (this._onCheckIfAdmin()) {
      this.dashboard_members = this.dashboard_members.filter(
        (team_member: Assignee) => team_member._id !== member._id
      );
      this.data.dashboard.team = this.data.dashboard.team.filter(
        (team_member: Member) => team_member._id !== member._id
      );
      this._onUpdateTeam();
    } else {
      this._onIsNotAdmin();
    }
  }

  private _onUpdateTeam(): void {
    if (this.data.dashboard.inactive) {
      this._onIsInactive();
      return;
    }
    this.socketDashboardService.updateDashboard({
      board_id: this.data.dashboard.board_id,
      team: this.data.dashboard.team,
    });
    this._onFilterDashboardMembers();
  }

  private _onFilterDashboardMembers(): void {
    const dashboard_members: Array<Assignee> = [];
    this.data.dashboard.team.forEach((member: Member) => {
      const dashboard_member: Assignee = this.workspace_members.filter(
        (workspace_member: Assignee) => workspace_member._id === member._id
      )[0];
      if (dashboard_member) {
        dashboard_member.role = member.role;
        dashboard_members.push(dashboard_member);
      }
    });
    this.dashboard_members = dashboard_members;
  }

  private _onCheckIfAdmin(): boolean {
    const user: Assignee = this.dashboard_members.filter(
      (member: Assignee) => member._id === this.data.user._id
    )[0];
    return user ? (user.role === 'Admin' ? true : false) : false;
  }

  private _onIsNotAdmin(): void {
    this._showSnackbar('info', 'That action is only for admins');
  }

  public onCloseModal(): void {
    this.dialogRef.close();
  }

  private _onIsInactive(): void {
    this._showSnackbar('info', "Dashboard is inactive and can't be modified");
  }

  private _showSnackbar(severity: string, detail: string): void {
    this.messageService.add({
      severity,
      detail,
    });
  }
}
