import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DeleteComponent } from 'src/app/shared/modals/delete/delete.component';
import { HttpResponse } from 'src/app/shared/models/http-response.model';
import { SharedService } from 'src/app/shared/services/shared.service';
import { User } from 'src/app/user/models/user.model';
import { UserService } from 'src/app/user/services/user.service';
import { AggregatedMember } from 'src/app/workspace/models/aggregated-member.model';
import { AggregatedWorkspace } from 'src/app/workspace/models/aggregated-workspace.model';
import { Member } from 'src/app/workspace/models/member.model';
import { Workspace } from 'src/app/workspace/models/workspace.model';
import { WorkspaceService } from 'src/app/workspace/services/workspace.service';
import { CreateMemberToken } from '../../models/create-member-token.model';
import { UpdateMember } from '../../models/update-member.model';
import { TeamService } from '../../services/team.service';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss'],
  providers: [MessageService, ConfirmationService],
})
export class TeamComponent implements OnInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject();
  workspace!: AggregatedWorkspace;
  not_found: boolean = false;
  is_loading: boolean = true;
  display_dialog: boolean = false;
  aggregated_members: Array<AggregatedMember> = [];
  workspaceForm!: FormGroup;
  memberForm!: FormGroup;
  current_user: User | null = null;
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
    private confirmationService: ConfirmationService,
    private sharedService: SharedService,
    public dialog: MatDialog,
    private userService: UserService,
    private formBuilder: FormBuilder
  ) {}

  public ngOnInit(): void {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      if (params.id) {
        this.workspaceService.getAggregatedWorkspace(params.id).subscribe({
          next: (res: HttpResponse) => {
            this.workspace = res.data[0];
            this.getMembers(this.workspace);
            this.userService
              .getCurrentUser()
              .pipe(takeUntil(this.destroy$))
              .subscribe((user) => {
                this.current_user = user;
              });
            this.onSetFormWorkspace();
            this.onSetFormMember();
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
    if (!this._onCheckIfAdmin()) {
      this._onIsNotAdmin();
      return;
    }
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
    if (!this._onCheckIfAdmin()) {
      this._onIsNotAdmin();
      return;
    }
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

  public onAddMember(form: FormGroup): void {
    if (!this._onCheckIfAdmin()) {
      this._onIsNotAdmin();
      return;
    }
    if (form.invalid) {
      form.reset();
      this._showSnackbar('error', 'Enter valid email address');
      return;
    }
    const payload: CreateMemberToken = {
      workspace_id: this.workspace.workspace_id as string,
      email: form.value.email,
    };
    this.teamService.addMember(payload).subscribe({
      next: (data) => {
        if (data.statusCode === 201) {
          this._showSnackbar('info', `Sent join email to ${form.value.email}`);
        } else {
          this._showSnackbar('error', "Could't add team member");
        }
      },
      error: () => {
        this._showSnackbar('error', "Could't add team member");
      },
    });
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

  public onSetFormMember(): void {
    this.memberForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  public onSaveWorkspaceTitle(form: FormGroup): void {
    if (!this._onCheckIfAdmin()) {
      this._onIsNotAdmin();
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

  private _onCheckIfAdmin(): boolean {
    const user: Member = this.workspace.team.filter(
      (member: Member) => member._id === this.current_user!._id
    )[0];
    if (user) {
      return user.role === 'Admin' || user.role === 'Owner' ? true : false;
    } else {
      return false;
    }
  }

  private _onIsNotAdmin(): void {
    this._showSnackbar('info', 'That action is only for admins');
  }

  private _showSnackbar(severity: string, detail: string): void {
    this.messageService.add({
      severity,
      detail,
    });
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

  private _onIsNotAdminOrOwner(role: string): void {
    this._showSnackbar('info', `That action is only for ${role}`);
  }

  items: Array<MenuItem> = [
    {
      label: 'Delete workspace',
      icon: 'pi pi-fw pi-trash',
      command: () => {
        this._onDeleteWorkspace();
      },
    },
  ];
}
