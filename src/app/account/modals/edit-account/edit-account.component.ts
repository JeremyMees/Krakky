import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { containsNumberValidator } from 'src/app/shared/directives/contains-number/contains-number.directive';
import { HttpResponse } from 'src/app/shared/models/http-response.model';
import { UpdateUser } from 'src/app/user/models/update-user.model';
import { User } from 'src/app/user/models/user.model';
import { UserService } from 'src/app/user/services/user.service';

@Component({
  selector: 'app-edit-account',
  templateUrl: './edit-account.component.html',
  styleUrls: ['./edit-account.component.scss'],
  providers: [MessageService],
})
export class EditAccountComponent implements OnInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject();
  userForm!: FormGroup;
  inputType: string = 'password';
  inputIcon: string = 'pi pi-eye';
  forgotPassword: boolean = false;
  change_username: boolean = false;
  change_email: boolean = false;
  change_password: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<EditAccountComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { user: User },
    private messageService: MessageService,
    private formBuilder: FormBuilder,
    private userService: UserService
  ) {}

  public ngOnInit(): void {
    this._onSetForm();
  }

  public ngOnDestroy(): void {
    this.destroy$.next(true);
  }

  public onGoBack(): void {
    this.dialogRef.close();
  }

  public onUpdateUser(form: FormGroup): void {
    if (form.invalid) {
      this._onSetForm();
      this._showSnackbar('error', "Form wasn't filled correctly");
      return;
    }
    if (form.value.new_password) {
      if (form.value.new_password === form.value.password) {
        this._showSnackbar(
          'error',
          "New password can't be the same as the current password"
        );
        form.controls['new_password'].reset();
        return;
      }
    }
    this.userService
      .onUpdateUser(this._onGenerateUpdatedUser(form))
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: HttpResponse) => {
          if (res.statusCode === 200) {
            this._onUpdateUserLocalStorage(res.data);
            this.dialogRef.close();
          } else {
            this._showSnackbar('error', "Couldn't update user");
            this._onSetForm();
          }
        },
        error: () => {
          this._showSnackbar('error', 'Error while updating user');
          this._onSetForm();
        },
      });
  }

  private _onUpdateUserLocalStorage(user: User): void {
    this.data.user.email = user.email;
    this.data.user.username = user.username;
    this.userService.onSetCurrentUser(this.data.user);
    const local_user: string = localStorage.getItem('user') as string;
    const updated_user: User = JSON.parse(local_user);
    updated_user.email = user.email;
    updated_user.username = user.username;
    localStorage.setItem('user', JSON.stringify(updated_user));
  }

  private _onGenerateUpdatedUser(form: FormGroup): { [key: string]: string } {
    const user: { [key: string]: string } = {
      _id: this.data.user._id as string,
    };
    for (const [key, value] of Object.entries(form.value)) {
      if (value) {
        user[key] = form.value[key];
      }
    }
    return user;
  }

  private _onSetForm(): void {
    this.userForm = this.formBuilder.group({
      username: [
        this.data.user.username,
        [Validators.minLength(4), Validators.maxLength(12)],
      ],
      email: [this.data.user.email, [Validators.email]],
      new_password: [
        '',
        [
          Validators.minLength(6),
          Validators.maxLength(20),
          containsNumberValidator,
        ],
      ],
      password: ['', Validators.required],
    });
  }

  public changeInputType(): void {
    if (this.inputType === 'password') {
      this.inputType = 'text';
      this.inputIcon = 'pi pi-eye-slash';
    } else {
      this.inputType = 'password';
      this.inputIcon = 'pi pi-eye';
    }
  }

  private _showSnackbar(severity: string, detail: string): void {
    this.messageService.add({
      severity,
      detail,
    });
  }
}
