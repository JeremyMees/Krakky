import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Card } from 'src/app/card/models/card.model';
import { CardService } from 'src/app/card/services/card.service';
import { Dashboard } from 'src/app/dashboard/models/dashboard.model';
import { DashboardService } from 'src/app/dashboard/service/dashboard.service';
import { HttpResponse } from 'src/app/shared/models/http-response.model';
import { User } from 'src/app/user/models/user.model';
import { UserService } from 'src/app/user/services/user.service';
import { Workspace } from 'src/app/workspace/models/workspace.model';
import { WorkspaceService } from 'src/app/workspace/services/workspace.service';
import { CharacterComponent } from '../../modals/character/character.component';
import { EditAccountComponent } from '../../modals/edit-account/edit-account.component';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
  providers: [MessageService],
})
export class AccountComponent implements OnInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject();
  user!: User;
  marketing: boolean = false;
  dashboards: Array<Dashboard> = [];
  workspaces: Array<Workspace> = [];
  created_cards: Array<Card> = [];
  assigned_cards: Array<Card> = [];
  loading_dashboards: boolean = false;
  loading_cards_created: boolean = false;
  loading_cards_assigned: boolean = false;
  loading_workspaces: boolean = false;

  constructor(
    private userService: UserService,
    public dialog: MatDialog,
    private dashboardService: DashboardService,
    private messageService: MessageService,
    private cardService: CardService,
    private workspaceService: WorkspaceService
  ) {}

  public ngOnInit(): void {
    this._onGetCurrentUser();
  }

  public ngOnDestroy(): void {
    this.destroy$.next(true);
  }

  private _onGetCurrentUser(): void {
    this.userService
      .getCurrentUser()
      .pipe(takeUntil(this.destroy$))
      .subscribe((user) => {
        this.user = user as User;
        this.marketing = user!.marketing as boolean;
        this._onGetDashboards();
        this._onGetCreatedCards();
        this._onGetAssignedCards();
        this._onGetWorkspaces();
      });
  }

  public openDialogCharacter(): void {
    this.dialog.open(CharacterComponent, {
      width: '100%',
      maxWidth: '600px',
      data: this.user,
    });
  }

  public openDialogUpdateAccount(): void {
    this.dialog.open(EditAccountComponent, {
      width: '100%',
      maxWidth: '600px',
      data: { user: this.user },
      autoFocus: false,
      panelClass: 'custom-modalbox',
    });
  }

  private _onGetDashboards(): void {
    this.loading_dashboards = true;
    this.dashboardService
      .getDashboardsFromMember(this.user._id as string)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: HttpResponse) => {
          if (res.statusCode === 200) {
            this.dashboards = res.data;
          } else {
            this._showSnackbar('error', "Couldn't fetch dashboards");
          }
          this.loading_dashboards = false;
        },
        error: () => {
          this._showSnackbar('error', "Couldn't fetch dashboards");
          this.loading_dashboards = false;
        },
      });
  }

  private _onGetCreatedCards(): void {
    this.loading_cards_created = true;
    this.cardService
      .getCardsCreated(this.user._id as string)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: HttpResponse) => {
          if (res.statusCode === 200) {
            this.created_cards = res.data;
          } else {
            this._showSnackbar('error', "Couldn't fetch cards");
          }
          this.loading_cards_created = false;
        },
        error: () => {
          this._showSnackbar('error', "Couldn't fetch cards");
          this.loading_cards_created = false;
        },
      });
  }

  private _onGetAssignedCards(): void {
    this.loading_cards_assigned = true;

    this.cardService
      .getCardsAssigned(this.user._id as string)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: HttpResponse) => {
          if (res.statusCode === 200) {
            this.assigned_cards = res.data;
          } else {
            this._showSnackbar('error', "Couldn't fetch cards");
          }
          this.loading_cards_assigned = false;
        },
        error: () => {
          this._showSnackbar('error', "Couldn't fetch cards");
          this.loading_cards_assigned = false;
        },
      });
  }

  private _onGetWorkspaces(): void {
    this.loading_workspaces = true;
    this.workspaceService
      .getWorkspacesFromMember(this.user._id as string)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: HttpResponse) => {
          if (res.statusCode === 200) {
            this.workspaces = res.data;
          } else {
            this._showSnackbar('error', "Couldn't fetch cards");
          }
          this.loading_workspaces = false;
        },
        error: () => {
          this.loading_workspaces = false;

          this._showSnackbar('error', "Couldn't fetch cards");
        },
      });
  }

  public onToggleMarketingMails(): void {
    this.userService
      .onUpdateSettingsUser({
        _id: this.user._id as string,
        marketing: this.user.marketing,
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: HttpResponse) => {
          if (res.statusCode === 200) {
            this._onUpdateUserLocalStorage(res.data);
            this._showSnackbar('info', 'User settings updated succesfully');
          } else {
            this._showSnackbar('error', "Couldn't update user settings");
          }
        },
        error: () => {
          this._showSnackbar('error', "Couldn't update user settings");
        },
      });
  }

  private _onUpdateUserLocalStorage(user: User): void {
    this.userService.setCurrentUser(user);
    const local_user: string = localStorage.getItem('user') as string;
    const updated_user: User = JSON.parse(local_user);
    updated_user.marketing = user.marketing;
    localStorage.setItem('user', JSON.stringify(updated_user));
  }

  private _showSnackbar(severity: string, detail: string): void {
    this.messageService.add({
      severity,
      detail,
    });
  }
}
