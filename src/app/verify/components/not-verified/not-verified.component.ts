import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MailService } from 'src/app/mail/services/mail.service';
import { HttpResponse } from 'src/app/shared/models/http-response.model';
import { User } from 'src/app/user/models/user.model';
import { UserService } from 'src/app/user/services/user.service';

@Component({
  selector: 'app-not-verified',
  templateUrl: './not-verified.component.html',
  styleUrls: ['./not-verified.component.scss'],
  providers: [MessageService],
})
export class NotVerifiedComponent implements OnInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject();
  user!: User;
  sent: boolean = false;

  constructor(
    public router: Router,
    private userService: UserService,
    private messageService: MessageService,
    private mailService: MailService
  ) {}

  public ngOnInit(): void {
    this.userService
      .onGetCurrentUser()
      .pipe(takeUntil(this.destroy$))
      .subscribe((user) => {
        this.user = user as User;
      });
  }

  public ngOnDestroy(): void {
    this.destroy$.next(true);
  }

  public onNewVerifyEmail(): void {
    this.sent
      ? this._showSnackbar(
          'info',
          `New email was already sent to ${this.user.email}`
        )
      : this._onSendVerifyEmail();
  }

  private _onSendVerifyEmail(): void {
    this.mailService
      .onSendVerifyEmail({
        username: this.user.username ? this.user.username : '',
        email: this.user.email,
        id: this.user._id!,
      })
      .subscribe({
        next: (res: HttpResponse) => {
          if (res.statusCode === 200) {
            this._showSnackbar(
              'info',
              `Sent new verify email to ${this.user.email}`
            );
            this.sent = true;
          } else {
            this._showSnackbar('error', `Couldn't send verify email`);
          }
        },
        error: () => {
          this._showSnackbar('error', `Couldn't send verify email`);
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
