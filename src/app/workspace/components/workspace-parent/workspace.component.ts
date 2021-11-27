import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { HttpResponse } from 'src/app/shared/models/http-response.model';
import { User } from 'src/app/user/models/user.model';
import { UserService } from 'src/app/user/services/user.service';
import { AggregatedWorkspace } from '../../models/aggregated-workspace.model';
import { WorkspaceService } from '../../services/workspace.service';

@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.scss'],
  providers: [MessageService],
})
export class WorkspaceComponent implements OnInit, OnDestroy {
  current_user: User | null = null;
  current_user_sub$: Subscription = new Subscription();
  workspaces: Array<AggregatedWorkspace> = [];
  selected_workspace: AggregatedWorkspace | undefined;
  workspace_id: string | undefined;
  destroy$: Subject<boolean> = new Subject();
  isLoading: boolean = true;
  constructor(
    private userService: UserService,
    private workspaceService: WorkspaceService,
    private messageService: MessageService,
    public route: ActivatedRoute
  ) {}

  public ngOnInit(): void {
    this.current_user_sub$ = this.userService
      .getCurrentUser()
      .subscribe((user) => {
        this.current_user = user;
      });
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      if (params.id) {
        this.workspace_id = params.id as string;
        this.getWorkspace(this.workspace_id);
      } else {
        this.getAggregatedWorkspaces(this.current_user?._id as string);
      }
    });
  }

  public ngOnDestroy(): void {
    this.current_user_sub$.unsubscribe();
    this.destroy$.next(true);
  }

  public getWorkspace(id: string): void {
    this.workspaceService.getAggregatedWorkspace(id).subscribe({
      next: (res: HttpResponse) => {
        if (res.statusCode === 200) {
          this.selected_workspace = res.data[0];
        } else {
          this._showSnackbar('error', res.message);
        }
      },
      error: (res: HttpResponse) => {
        this._showSnackbar('error', res.message);
      },
    });
    this.isLoading = false;
  }

  public getAggregatedWorkspaces(user_id: string): void {
    this.workspaceService.getAggregatedWorkspaces(user_id).subscribe({
      next: (res: HttpResponse) => {
        if (res.statusCode === 200) {
          this.workspaces = res.data;
        } else {
          this._showSnackbar('error', res.message);
        }
      },
      error: (res: HttpResponse) => {
        this._showSnackbar('error', res.message);
      },
    });
    this.isLoading = false;
  }

  private _showSnackbar(severity: string, detail: string): void {
    this.messageService.add({
      severity,
      detail,
    });
  }
}
