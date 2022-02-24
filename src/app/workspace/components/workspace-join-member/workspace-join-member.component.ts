import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { HttpResponse } from 'src/app/shared/models/http-response.model';
import { User } from 'src/app/user/models/user.model';
import { UserService } from 'src/app/user/services/user.service';
import { Workspace } from '../../models/workspace.model';
import { WorkspaceService } from '../../services/workspace.service';

@Component({
  selector: 'app-workspace-join-member',
  templateUrl: './workspace-join-member.component.html',
  styleUrls: ['./workspace-join-member.component.scss'],
  providers: [MessageService],
})
export class WorkspaceJoinMemberComponent implements OnInit {
  destroy$: Subject<boolean> = new Subject();
  loading: boolean = true;
  params!: Params;
  user!: User;
  workspace!: Workspace;

  constructor(
    private userService: UserService,
    private workspaceService: WorkspaceService,
    private messageService: MessageService,
    private route: ActivatedRoute,
    public router: Router
  ) {}

  public ngOnInit(): void {
    this._onGetCurrentUser();
    this._onGetParams();
  }

  public ngOnDestroy(): void {
    this.destroy$.next(true);
  }

  private _onGetParams(): void {
    this.route.params
      .pipe(takeUntil(this.destroy$))
      .subscribe((params: Params) => {
        if (params.workspace_id && params.token) {
          this.params = params;
          this._onGetWorkspace(params.workspace_id);
        } else {
          this.router.navigateByUrl('home');
        }
      });
  }

  private _onGetWorkspace(id: string): void {
    this.workspaceService
      .onGetWorkspaces(id)
      .pipe(take(1))
      .subscribe((res: HttpResponse) => {
        if (res.statusCode === 200) {
          this.workspace = res.data[0];
          this.loading = false;
        } else {
          this.router.navigateByUrl('home');
        }
      });
  }

  private _onGetCurrentUser(): void {
    this.userService
      .onGetUser()
      .pipe(take(1))
      .subscribe((res: HttpResponse) => {
        if (res.statusCode === 200) {
          this.user = res.data;
        } else {
          this.router.navigateByUrl('home');
        }
      });
  }

  public onJoinWorkspace(): void {
    this.workspaceService
      .onJoinWorkspace({
        email: this.user.email,
        user_id: this.user._id as string,
        workspace_id: this.params.workspace_id,
        token: this.params.token.split('_').join('/'),
      })
      .pipe(take(1))
      .subscribe((res: HttpResponse) => {
        if (res.statusCode === 200) {
          this.router.navigateByUrl(`workspace/${this.params.workspace_id}`);
        } else {
          this._showSnackbar('error', "Couldn't join workspace");
          setTimeout(() => {
            this.router.navigateByUrl('home');
          }, 3000);
        }
      });
  }

  public onRouteToHome(): void {
    this.router.navigateByUrl(`home`);
  }

  private _showSnackbar(severity: string, detail: string): void {
    this.messageService.add({
      severity,
      detail,
    });
  }
}
