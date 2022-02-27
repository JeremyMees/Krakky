import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MailService } from 'src/app/mail/services/mail.service';
import { HttpResponse } from 'src/app/shared/models/http-response.model';
import { User } from 'src/app/user/models/user.model';
import { UserService } from 'src/app/user/services/user.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  providers: [MessageService],
})
export class ContactComponent implements OnInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject();
  user: User | undefined;
  contactForm!: FormGroup;

  constructor(
    private userService: UserService,
    private messageService: MessageService,
    private formBuilder: FormBuilder,
    private mailService: MailService
  ) {}

  public ngOnInit(): void {
    this.userService
      .onGetCurrentUser()
      .pipe(takeUntil(this.destroy$))
      .subscribe((user) => {
        this.user = user as User;
        this._onSetForm();
      });
  }

  public ngOnDestroy(): void {
    this.destroy$.next(true);
  }

  private _onSetForm(): void {
    if (this.user) {
      this.contactForm = this.formBuilder.group({
        username: [
          this.user.username,
          [
            Validators.required,
            Validators.minLength(4),
            Validators.maxLength(12),
          ],
        ],
        email: [this.user.email, [Validators.required, Validators.email]],
        message: [
          '',
          [
            Validators.required,
            Validators.minLength(1),
            Validators.maxLength(500),
          ],
        ],
      });
    } else {
      this.contactForm = this.formBuilder.group({
        username: [
          '',
          [
            Validators.required,
            Validators.minLength(4),
            Validators.maxLength(12),
          ],
        ],
        email: ['', [Validators.required, Validators.email]],
        message: [
          '',
          [
            Validators.required,
            Validators.minLength(1),
            Validators.maxLength(500),
          ],
        ],
      });
    }
  }

  public onContactUs(form: FormGroup): void {
    if (form.invalid) {
      this._onSetForm();
      this._showSnackbar('error', "Form wasn't filled correctly");
      return;
    }
    const { message, ...mail } = form.value;
    mail.text = message;
    this.mailService.onSendContactEmail(mail).subscribe({
      next: (res: HttpResponse) => {
        if (res.statusCode === 200) {
          this._showSnackbar('info', 'Email was sent correctly');
        } else {
          this._showSnackbar('error', `Couldn't send verify email`);
        }
      },
      error: () => {
        this._showSnackbar('error', `Couldn't send verify email`);
      },
    });
    this._onSetForm();
  }

  public onCopyEmail(): void {
    this._showSnackbar('info', 'Email address copied to clipboard');
  }

  private _showSnackbar(severity: string, detail: string): void {
    this.messageService.add({
      severity,
      detail,
    });
  }
}
