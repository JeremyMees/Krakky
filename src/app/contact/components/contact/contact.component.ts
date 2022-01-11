import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
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
    private messageService: MessageService
  ) {}

  public ngOnInit(): void {
    this.userService
      .getCurrentUser()
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
      this.contactForm = new FormGroup({
        username: new FormControl(this.user.username),
        email: new FormControl(this.user.email),
        message: new FormControl(''),
      });
    } else {
      this.contactForm = new FormGroup({
        username: new FormControl(''),
        email: new FormControl(''),
        message: new FormControl(''),
      });
    }
  }

  public onContactUs(form: FormGroup): void {
    if (form.invalid) {
      this._onSetForm();
      this._showSnackbar('error', "Form wasn't filled correctly");
      return;
    }
    this._showSnackbar('info', 'Email was sent correctly');
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
