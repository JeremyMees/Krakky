import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Card } from 'src/app/card/models/card.model';
import { List } from 'src/app/list/models/list.model';
import { DeleteComponent } from 'src/app/shared/modals/delete/delete.component';
import { HttpResponse } from 'src/app/shared/models/http-response.model';
import { User } from 'src/app/user/models/user.model';
import { UserService } from 'src/app/user/services/user.service';
import { Member } from 'src/app/workspace/models/member.model';
import { EditCardComponent } from '../../card/components/edit-card/edit-card.component';
import { DashboardMembersComponent } from '../modals/dashboard-members/dashboard-members.component';
import { AggregatedDashboard } from '../models/aggregated-dashboard.model';
import { DashboardService } from '../service/dashboard.service';
import { SocketDashboardService } from '../service/socket-dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [MessageService],
})
export class DashboardComponent implements OnInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject();
  is_loading: boolean = true;
  found: boolean = false;
  dashboard!: AggregatedDashboard;
  user!: User;
  connected_to: Array<string> = [];
  max_index_list: number = 0;
  selected_list: List | undefined;
  selected_card: Card | undefined;
  board_id!: string;
  private_checked: boolean = false;
  inactive_checked: boolean = false;

  constructor(
    private socketDashboardService: SocketDashboardService,
    private userService: UserService,
    private messageService: MessageService,
    public route: ActivatedRoute,
    public router: Router,
    private dashboardService: DashboardService,
    public dialog: MatDialog
  ) {}

  public ngOnInit(): void {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      if (params.id) {
        this._subscribeDashboard(params.id as string);
        this.userService
          .getCurrentUser()
          .pipe(takeUntil(this.destroy$))
          .subscribe((user) => {
            this.user = user as User;
          });
      } else {
        this._onFinish(false);
      }
    });
  }

  public ngOnDestroy(): void {
    this.destroy$.next(true);
    this.socketDashboardService.disconnect();
  }

  private _subscribeDashboard(id: string): void {
    this.socketDashboardService
      .onSubscribeDashboard(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: HttpResponse) => {
          if (res.statusCode === 200 || res.statusCode === 201) {
            this.private_checked = res.data.private;
            this.inactive_checked = res.data.inactive;
            this.dashboard = this._onTransformData(res.data);
            this._onFinish(true);
          } else {
            this._showSnackbar('error', 'Error while updating dashboard');
          }
        },
        error: () => {
          this._notFound();
        },
      });
  }

  private _onTransformData(data: AggregatedDashboard): AggregatedDashboard {
    data.lists = data.lists.sort((a, b) => a.index - b.index) as Array<List>;
    this.connected_to = [];
    data.lists.forEach((list: List) => {
      this.connected_to.push(list._id);
    });
    if (data.lists.length !== 0) {
      const index_list: number = Math.max.apply(
        null,
        data.lists.map((item) => item.index)
      );
      this.max_index_list = index_list + 1;
    }
    return data as AggregatedDashboard;
  }

  private _notFound(): void {
    this._onFinish(false);
    this.socketDashboardService.disconnect();
    this._showSnackbar('error', "Couldn't find dashboard");
  }

  private _onFinish(found: boolean): void {
    this.found = found;
    this.is_loading = false;
  }

  public onSaveDashboardTitle(form: NgForm): void {
    if (this.inactive_checked) {
      this._onIsInactive();
      return;
    }
    if (form.invalid) {
      form.reset();
      return;
    }
    this.dashboard.title = form.value.dashboard_name;
    const { cards, lists, ...payload } = this.dashboard;
    this.dashboardService.updateDashboard(payload).subscribe({
      error: () => {
        this._showSnackbar('error', 'Error while updating dashboard');
      },
    });
  }

  public drop(event: CdkDragDrop<Array<List>>) {
    if (this.inactive_checked) {
      this._onIsInactive();
      return;
    }
    moveItemInArray(
      this.dashboard.lists,
      event.previousIndex,
      event.currentIndex
    );
    const lowest_number: number = Math.min(
      event.currentIndex,
      event.previousIndex
    );
    this.dashboard.lists.forEach((list: List, index: number) => {
      if (index < lowest_number) {
        return;
      }
      list.index = index;
      this.socketDashboardService.updateList(list);
    });
  }

  public dropCard(event: any) {
    if (this.inactive_checked) {
      this._onIsInactive();
      return;
    }
    let filteredCards = this.filteredCards(event.container.id);
    if (event.previousContainer === event.container) {
      if (event.previousIndex === event.currentIndex) {
        return;
      }
      moveItemInArray(filteredCards, event.previousIndex, event.currentIndex);
      filteredCards.forEach((card: Card, index: number) => {
        card.index = index;
        this.socketDashboardService.updateCard(card);
      });
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      event.container.data.forEach((card: Card, index: number) => {
        card.list_id !== event.container.id
          ? (card.list_id = event.container.id)
          : (card.index = index);
        this.socketDashboardService.updateCard(card);
      });
    }
  }

  public filteredCards(id: string): Array<Card> {
    return this.dashboard.cards
      ?.filter((card) => card.list_id == id)
      .slice()
      .sort((a, b) => a.index - b.index) as Array<Card>;
  }

  public onUpdateListTitle(form: NgForm): void {
    if (this.inactive_checked) {
      this._onIsInactive();
      return;
    }
    if (form.invalid) {
      form.reset();
      return;
    }
    const index: number = this.dashboard.lists.findIndex(
      (list: List) => list._id === this.selected_list?._id
    );
    this.dashboard.lists[index].title = form.value.list_name;
    this.socketDashboardService.updateList(this.dashboard.lists[index]);
  }

  public onAddList(form: NgForm): void {
    if (this.inactive_checked) {
      this._onIsInactive();
      return;
    }
    if (form.invalid) {
      form.reset();
      return;
    }
    this.socketDashboardService.addList({
      board_id: this.dashboard.board_id,
      title: form.value.list_name,
    });
  }

  public onAddQuickCard(form: NgForm): void {
    if (this.inactive_checked) {
      this._onIsInactive();
      return;
    }
    if (form.invalid) {
      form.reset();
      return;
    }
    this.socketDashboardService.addCard({
      board_id: this.dashboard.board_id,
      title: form.value.card_name,
      list_id: this.selected_list?._id as string,
      created_by: this.user._id as string,
      created_at: Date.now(),
      color: 'white',
    });
  }

  public onDeleteList(list: List): void {
    if (this.inactive_checked) {
      this._onIsInactive();
      return;
    }
    const dialogRef = this.dialog.open(DeleteComponent, {
      data: { name: list.title, title: 'list' },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.socketDashboardService.deleteList(list);
      }
    });
  }

  public onUpdateCard(card: Card): void {
    if (this.inactive_checked) {
      this._onIsInactive();
      return;
    }
    this.dialog.open(EditCardComponent, {
      data: { card, dashboard: this.dashboard },
      maxWidth: '850px',
      width: '100%',
      autoFocus: false,
      panelClass: 'custom-modalbox',
    });
  }

  public onTransformDate(due_date: Date): string {
    const date: Date = new Date(due_date);
    const transformed_date: string = date.toLocaleString('en-us', {
      month: 'short',
      day: '2-digit',
    });
    return transformed_date;
  }

  public onCheckUsers(): void {
    this.dialog.open(DashboardMembersComponent, {
      data: { dashboard: this.dashboard, user: this.user },
      maxWidth: '650px',
      width: '100%',
      autoFocus: false,
      panelClass: 'custom-modalbox',
    });
  }

  public onToggleSetting(setting: string): void {
    if (this._onCheckIfAdmin()) {
      switch (setting) {
        case 'private':
          this._onUpdateDashboard({ private: this.private_checked });
          break;
        case 'inactive':
          this._onUpdateDashboard({ inactive: this.inactive_checked });
          break;
      }
    } else {
      switch (setting) {
        case 'private':
          this.private_checked
            ? (this.private_checked = false)
            : (this.private_checked = true);
          this._onIsNotAdmin();
          break;
        case 'inactive':
          this.inactive_checked
            ? (this.inactive_checked = false)
            : (this.inactive_checked = true);
          this._onIsNotAdmin();
          break;
      }
    }
  }

  private _onUpdateDashboard(obj: { [key: string]: any }): void {
    const board_id: { board_id: string } = {
      board_id: this.dashboard.board_id,
    };
    this.socketDashboardService.updateDashboard({ ...obj, ...board_id });
  }

  private _onCheckIfAdmin(): boolean {
    const user: Member = this.dashboard.team.filter(
      (member: Member) => member._id === this.user._id
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