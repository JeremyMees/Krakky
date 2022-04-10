import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
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
import { THEMES } from 'src/app/shared/data/themes.data';
import { HttpResponse } from 'src/app/shared/models/http-response.model';
import { RandomColors } from 'src/app/shared/models/random-colors.model';
import { SharedService } from 'src/app/shared/services/shared.service';
import { AddTag } from 'src/app/shared/models/add-tag.model';
import { User } from 'src/app/user/models/user.model';
import { UserService } from 'src/app/user/services/user.service';
import { Member } from 'src/app/workspace/models/member.model';
import { Workspace } from 'src/app/workspace/models/workspace.model';
import { Comment } from '../../models/comment.model';
import { Tag } from 'src/app/shared/models/tag.model';
import { LoopObject } from 'src/app/shared/models/loop-object.model';

@Component({
  selector: 'app-edit-card',
  templateUrl: './edit-card.component.html',
  styleUrls: ['./edit-card.component.scss'],
  providers: [MessageService, ConfirmationService],
})
export class EditCardComponent implements OnInit {
  @ViewChild('description') description!: ElementRef;
  @ViewChild('comment_update') comment_update!: ElementRef;
  @ViewChild('tag') tag!: ElementRef;
  list!: List;
  members: Array<Assignee> = [];
  assignees: Array<Assignee> = [];
  not_assignees: Array<Assignee> = [];
  destroy$: Subject<boolean> = new Subject();
  themes: Array<string> = THEMES;
  edit_description: boolean = false;
  checked: boolean = false;
  start_date: Date | undefined;
  due_date: Date | undefined;
  invalid_dates: Array<Date> = [];
  user!: User;
  edit_comment: boolean = false;
  selected_comment: Comment | undefined;
  tagForm!: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<EditCardComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      card: Card;
      dashboard: AggregatedDashboard;
      workspace: Workspace;
    },
    private cardService: CardService,
    private messageService: MessageService,
    private socketDashboardService: SocketDashboardService,
    private confirmationService: ConfirmationService,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private sharedService: SharedService
  ) {}

  public ngOnInit(): void {
    this._getMemberInfo();
    this.userService
      .onGetCurrentUser()
      .pipe(takeUntil(this.destroy$))
      .subscribe((user) => {
        this.user = user as User;
      });
    this.list = this.data.dashboard.lists.filter(
      (list: List) => list._id === this.data.card.list_id
    )[0];
    this._onGetDates();
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
    switch (color) {
      case 'lightgreen':
        this.data.card.color = 'green';
        break;
      case 'lightblue':
        this.data.card.color = 'blue';
        break;
      default:
        this.data.card.color = color;
        break;
    }
    this.socketDashboardService.updateCard(this.data.card);
  }

  private _getMemberInfo(): void {
    const team: Array<Member> = this.data.dashboard.private
      ? this.data.dashboard.team
      : this.data.workspace.team;
    this.cardService
      .getMemberInfo(team)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: HttpResponse) => {
          if (res.statusCode === 200) {
            this.members = res.data;
            this._onFilterAssignees(res.data);
            this._onFilterComments(res.data);
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
      message: 'Are you sure that you want to delete this card?',
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

  public onSaveTag(form: FormGroup): void {
    if (form.invalid) {
      form.reset();
      return;
    }
    const tag: AddTag = {
      color: this.sharedService.onGenerateOppositeColor(form.value.color),
      bg_color: form.value.color,
      description: form.value.description,
      board_id: this.data.dashboard.board_id,
      card_id: this.data.card._id!,
    };
    this._onCreateNewTag(tag);
    this.onSetTagForm();
  }

  public onRemoveTag(remove_tag: Tag): void {
    const index: number = this.data.card.tags.findIndex(
      (tag: Tag) => tag === remove_tag
    );
    if (index > -1) {
      this.data.card.tags.splice(index, 1);
      this.socketDashboardService.updateCard(this.data.card);
      this.onSetTagForm();
    }
  }

  public onAddTag(tag: Tag): void {
    const add_tag: any = tag;
    add_tag.card_id = this.data.card._id;
    add_tag.board_id = this.data.card.board_id;
    this._onCreateNewTag(add_tag);
  }

  private _onCreateNewTag(add_tag: AddTag): void {
    const tags: LoopObject = {
      card_tags: this.data.card.tags ? this.data.card.tags : [],
      board_tags: this.data.dashboard.recent_tags
        ? this.data.dashboard.recent_tags
        : [],
    };
    for (const key in tags) {
      const index: number = tags[key].findIndex(
        (tag: Tag) => tag.description === add_tag.description
      );
      if (key === 'card_tags') {
        if (index > -1) {
          this._showSnackbar('info', 'Tag already is active on card');
          return;
        } else {
          tags[key] ? tags[key].unshift(add_tag) : (tags[key].tags = [add_tag]);
          if (tags[key].length > 3) {
            tags[key].pop();
            this._showSnackbar('info', 'Card already has 3 active tags');
          }
          this.data.card.tags = tags[key];
        }
      } else {
        if (index > -1) {
          tags[key].splice(index, 1);
        }
        tags[key] ? tags[key].unshift(add_tag) : (tags[key].tags = [add_tag]);
        tags[key].length > 10 ? tags[key].pop() : undefined;
        this.data.dashboard.recent_tags = tags[key];
      }
    }
    this.socketDashboardService.addTag(add_tag);
  }

  public onFocusOnTagInput(): void {
    setTimeout(() => {
      this.tag?.nativeElement.select();
    });
  }

  public onSetTagForm(): void {
    const random_colors: RandomColors =
      this.sharedService.onGenerateRandomColors();
    this.tagForm = this.formBuilder.group(
      {
        description: [
          '',
          [
            Validators.required,
            Validators.minLength(1),
            Validators.maxLength(10),
          ],
        ],
        color: [random_colors.bg_color, [Validators.required]],
      },
      { updateOn: 'submit' }
    );
  }

  public onSaveDates(): void {
    if (
      (this.start_date?.getTime() as number) <
      new Date().getTime() - 86400000
    ) {
      this.data.card.start_date
        ? (this.start_date = new Date(this.data.card.start_date as Date))
        : (this.start_date = undefined);
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

  public onCheckDueDate(date: Date): boolean {
    const due_date: Date = new Date(date);
    const now: Date = new Date();
    now.setHours(0, 0, 0, 0);
    return due_date < now ? true : false;
  }

  public onConfirmComplete(event: Event): void {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure that this card is completed?',
      icon: 'pi pi-check',
      accept: () => {
        this.onAddCompletionDate();
      },
    });
  }

  private onAddCompletionDate(): void {
    this.data.card.completion_date = new Date();
    this.socketDashboardService.updateCard(this.data.card);
  }

  public onAddComment(content: string): void {
    if (!this.data.card.comments) {
      this.data.card.comments = [];
    }
    const comment: Comment = {
      content,
      user_id: this.user._id as string,
      created_at: Date.now(),
      updated_at: Date.now(),
    };
    this.data.card.comments.unshift(comment);
    this.socketDashboardService.updateCard(this.data.card);
    const user_comment = this.members.filter(
      (member: Assignee) => member._id === comment.user_id
    )[0];
    comment.user = user_comment;
  }

  public onDeleteComment(comment: Comment): void {
    this.data.card.comments = this.data.card.comments!.filter(
      (com: Comment) => com !== comment
    );
    this.socketDashboardService.updateCard(this.data.card);
  }

  public onStartUpdateComment(comment: Comment): void {
    this.selected_comment = comment;
    this.edit_comment = true;
    setTimeout(() => {
      this.comment_update.nativeElement.select();
    });
  }

  public onUpdateComment(content: string): void {
    const index: number = this.data.card.comments!.findIndex(
      (com: Comment) => com === this.selected_comment
    );
    this.data.card.comments![index].content = content;
    this.data.card.comments![index].updated_at = Date.now();
    this.edit_comment = false;
    this.socketDashboardService.updateCard(this.data.card);
  }

  private _onFilterComments(members: Array<Assignee>): void {
    this.data.card.comments?.forEach((comment: Comment) => {
      const user_comment = members.filter(
        (member: Assignee) => member._id === comment.user_id
      )[0];
      comment.user = user_comment;
    });
  }

  public onSortComments(): Array<Comment> {
    if (this.data.card.comments) {
      this.data.card.comments.sort((a: Comment, b: Comment) => {
        return Number(new Date(a.created_at)) - Number(new Date(b.created_at));
      });
      return this.data.card.comments;
    } else {
      return [];
    }
  }

  private _showSnackbar(severity: string, detail: string): void {
    this.messageService.add({
      severity,
      detail,
    });
  }
}
