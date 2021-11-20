import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { HttpResponse } from 'src/app/shared/models/http-response.model';
import { AggregatedMember } from 'src/app/workspace/models/aggregated-member.model';
import { Member } from 'src/app/workspace/models/member.model';
import { Workspace } from 'src/app/workspace/models/workspace.model';
import { WorkspaceService } from 'src/app/workspace/services/workspace.service';
import { CreateMemberToken } from '../models/create-member-token.model';
import { UpdateMember } from '../models/update-member.model';
import { TeamService } from '../services/team.service';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss'],
  providers: [MessageService, ConfirmationService],
})
export class TeamComponent implements OnInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject();
  workspace!: Workspace;
  not_found: boolean = false;
  is_loading: boolean = true;
  display_dialog: boolean = false;
  aggregated_members: Array<AggregatedMember> = [];
  roles: Array<{ name: string; inactive?: boolean }> = [
    { name: 'Owner', inactive: true },
    { name: 'Admin' },
    { name: 'Member' },
  ];

  constructor(
    private workspaceService: WorkspaceService,
    private messageService: MessageService,
    public route: ActivatedRoute,
    public router: Router,
    private teamService: TeamService,
    private confirmationService: ConfirmationService
  ) {}

  public ngOnInit(): void {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      if (params.id) {
        this.workspaceService.getWorkspaces(params.id).subscribe({
          next: (res: HttpResponse) => {
            this.workspace = res.data[0];
            this.getMembers(this.workspace);
          },
          error: () => {
            this._showSnackbar('error', "Could't find team members");
            this.not_found = true;
            this.is_loading = false;
          },
        });
      } else {
        this.not_found = true;
        this.is_loading = false;
      }
    });
  }

  public ngOnDestroy(): void {
    this.destroy$.next(true);
  }

  public getMembers(workspace: Workspace): any {
    this.workspaceService
      .getMembersInfo(workspace.team)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: HttpResponse) => {
          if (res.statusCode === 200) {
            res.data.forEach((member: AggregatedMember) => {
              const updateIndex = workspace.team.findIndex(
                (team_member: Member) => team_member._id === member._id
              );
              member.role = workspace.team[updateIndex].role;
              this.aggregated_members.push(member);
              this.is_loading = false;
            });
          } else {
            this._showSnackbar('error', "Could't find team members");
            this.is_loading = false;
          }
        },
      });
  }

  public onChangeRole(member: AggregatedMember, role: string): void {
    const index: number = this.workspace.team.findIndex(
      (teamMember: Member) => teamMember._id === member._id
    );
    const aggregated_index: number = this.aggregated_members.findIndex(
      (teamMember: AggregatedMember) => teamMember._id === member._id
    );
    this.aggregated_members[index].role = role;
    this.workspace.team[aggregated_index].role = role;
    const payload: UpdateMember = {
      workspace_id: this.workspace.workspace_id as string,
      team: this.workspace.team,
    };
    this.teamService.updateMember(payload).subscribe({
      error: () => {
        this._showSnackbar('error', "Could't update team member");
      },
    });
  }

  public onConfirm(event: Event, member: AggregatedMember): void {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: `Are you sure that you want to remove ${member.username}?`,
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        const payload: UpdateMember = {
          workspace_id: this.workspace.workspace_id as string,
          team: this.workspace.team.filter(
            (team_member: Member) => team_member._id !== member._id
          ),
        };
        this.teamService.updateMember(payload).subscribe({
          next: () => {
            this.workspace.team = this.workspace.team.filter(
              (team_member: Member) => team_member._id !== member._id
            );
            this.aggregated_members = this.aggregated_members.filter(
              (team_member: AggregatedMember) => team_member._id !== member._id
            );
          },
          error: () => {
            this._showSnackbar('error', "Could't remove team member");
          },
        });
      },
    });
  }

  public onAddMember(form: NgForm): void {
    if (form.invalid) {
      form.reset();
      return;
    }
    const payload: CreateMemberToken = {
      workspace_id: this.workspace.workspace_id as string,
      email: form.value.email,
    };
    this.teamService.addMember(payload).subscribe({
      next: (data) => {
        if (data.statusCode === 201) {
          this._showSnackbar('success', `Succesfully sent join email`);
        } else {
          this._showSnackbar('error', "Could't add team member");
        }
      },
      error: () => {
        this._showSnackbar('error', "Could't add team member");
      },
    });
  }

  private _showSnackbar(severity: string, detail: string): void {
    this.messageService.add({
      severity,
      detail,
    });
  }
}
