import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Assignee } from 'src/app/card/models/assignee.model';
import { Card } from 'src/app/card/models/card.model';
import { CardService } from 'src/app/card/services/card.service';
import { AggregatedDashboard } from 'src/app/dashboard/models/aggregated-dashboard.model';
import { SocketDashboardService } from 'src/app/dashboard/service/socket-dashboard.service';
import { List } from 'src/app/list/models/list.model';
import { PRIORITYS } from 'src/app/shared/data/priority.data';
import { THEMES } from 'src/app/shared/data/themes.data';
import { HttpResponse } from 'src/app/shared/models/http-response.model';

@Component({
  selector: 'app-edit-card',
  templateUrl: './edit-card.component.html',
  styleUrls: ['./edit-card.component.scss'],
  providers: [MessageService, ConfirmationService],
})
export class EditCardComponent implements OnInit {
  @ViewChild('description') description!: ElementRef;
  list!: List;
  members: Array<Assignee> = [];
  assignees: Array<Assignee> = [];
  not_assignees: Array<Assignee> = [];
  destroy$: Subject<boolean> = new Subject();
  themes: Array<string> = THEMES;
  prioritys: Array<string> = PRIORITYS;
  edit_description: boolean = false;
  checked: boolean = false;
  start_date: Date | undefined;
  due_date: Date | undefined;
  invalid_dates: Array<Date> = [];

  constructor(
    public dialogRef: MatDialogRef<EditCardComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      card: Card;
      dashboard: AggregatedDashboard;
    },
    private cardService: CardService,
    private messageService: MessageService,
    private socketDashboardService: SocketDashboardService,
    private confirmationService: ConfirmationService
  ) {}

  public ngOnInit(): void {
    console.log(this.data);
    this.list = this.data.dashboard.lists.filter(
      (list: List) => list._id === this.data.card.list_id
    )[0];
    this._onGetDates();
    this._getMemberInfo();
  }

  public ngOnDestroy(): void {
    this.destroy$.next(true);
  }

  public onUpdateCardTitle(form: NgForm): void {
    if (form.invalid) {
      form.reset();
      return;
    }
    this.data.card.title = form.value.card_name;
    this.socketDashboardService.updateCard(this.data.card);
  }

  public onAddAssignee(assignee: Assignee): void {
    if (
      this.assignees.filter((person: Assignee) => person._id === assignee._id)
        .length > 0
    ) {
      this._showSnackbar('info', 'Member already assigned to this card');
    } else {
      this.data.card.assignees!.push({ _id: assignee._id as string });
      this.socketDashboardService.updateCard(this.data.card);
      this.assignees.push(assignee);
      this.not_assignees = this.not_assignees.filter(
        (person: Assignee) => person._id !== assignee._id
      );
    }
  }

  public onChangeList(list: List): void {
    this.data.card.list_id = list._id;
    this.list = list;
    this.socketDashboardService.updateCard(this.data.card);
  }

  public onChangeColor(color: string): void {
    this.data.card.color = color;
    this.socketDashboardService.updateCard(this.data.card);
  }

  private _getMemberInfo(): void {
    this.cardService
      .getMemberInfo(this.data.dashboard.team)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: HttpResponse) => {
          if (res.statusCode === 200) {
            this.members = res.data;
            this._onFilterAssignees(res.data);
          } else {
            this._showSnackbar('error', "Couldn't get assignee information");
          }
        },
        error: () => {
          this._showSnackbar('error', "Couldn't get assignee information");
        },
      });
  }

  private _onFilterAssignees(members: Array<Assignee>): void {
    this.data.card.assignees?.forEach((assignee: { _id: string }) => {
      members.forEach((member: Assignee) => {
        if (assignee._id === member._id) {
          this.assignees.push(member);
        } else {
          this.not_assignees.push(member);
        }
      });
    });
  }

  public onStartEditDescription(): void {
    this.edit_description = true;
    setTimeout(() => {
      this.description.nativeElement.select();
    }, 0);
  }

  public onConfirmDelete(event: Event): void {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure that you want to proceed?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this._onRemoveCard();
      },
    });
  }

  private _onRemoveCard(): void {
    this.socketDashboardService.deleteCard(this.data.card);
    this.dialogRef.close();
  }

  public onUpdateDescription(description: string): void {
    this.data.card.content = description;
    this.edit_description = false;
    this.socketDashboardService.updateCard(this.data.card);
  }

  public onSetPriority(priority?: string): void {
    if (priority) {
      this.data.card.priority = priority;
    } else {
      this.data.card.priority = '';
    }
    this.socketDashboardService.updateCard(this.data.card);
  }

  public onSaveDates(): void {
    if ((this.start_date?.getTime() as number) < new Date().getTime()) {
      this.start_date = new Date(this.data.card.start_date as Date);
      this._showSnackbar(
        'error',
        "Couldn't save start date that is in the past"
      );
      return;
    } else if (
      (this.start_date?.getTime() as number) >
      (this.due_date?.getTime() as number)
    ) {
      this.start_date = new Date(this.data.card.start_date as Date);
      this._showSnackbar(
        'error',
        "Couldn't save start date that starts after the due date"
      );
      return;
    } else {
      this.data.card.start_date = this.start_date;
    }
    if (
      (this.due_date?.getTime() as number) <
      (this.start_date?.getTime() as number)
    ) {
      this.due_date = new Date(this.data.card.due_date as Date);
      this._showSnackbar(
        'error',
        "Couldn't save due date that is before the start date"
      );
      return;
    } else {
      this.data.card.due_date = this.due_date;
    }
    this.socketDashboardService.updateCard(this.data.card);
  }

  public onResetDates(): void {
    this.start_date = undefined;
    this.due_date = undefined;
  }

  private _onGetDates(): void {
    if (this.data.card.start_date) {
      this.start_date = new Date(this.data.card.start_date as Date);
    }
    if (this.data.card.due_date) {
      this.due_date = new Date(this.data.card.due_date as Date);
    }
  }

  private _showSnackbar(severity: string, detail: string): void {
    this.messageService.add({
      severity,
      detail,
    });
  }
}
