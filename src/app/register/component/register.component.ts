import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MessageService } from 'primeng/api';
import { HttpResponse } from 'src/app/shared/models/http-response.model';
import { UserAdd } from 'src/app/user/services/models/add_user.model';
import { UserService } from '../../user/services/user.service';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  providers: [MessageService],
})
export class RegisterComponent {
  used: boolean | undefined;
  inputType: string = 'password';
  inputIcon: string = 'pi pi-eye';

  constructor(
    private messageService: MessageService,
    private dialogRef: MatDialogRef<RegisterComponent>,
    private userService: UserService
  ) {}

  onRegister(form: NgForm): void {
    if (form.invalid) {
      form.reset();
      this._showSnackbar('error', "Form wasn't filled correctly");
      return;
    } else if (form.value.password.length < 6) {
      this._showSnackbar('error', 'Password need to be at least 6 characters');
      form.controls['password'].reset();
      return;
    } else if (!/\d/.test(form.value.password)) {
      this._showSnackbar(
        'error',
        'Password needs to contain at least 1 number'
      );
      form.controls['password'].reset();
      return;
    } else if (form.value.username.length < 4) {
      this._showSnackbar('error', 'Username need to be at least 4 characters');
      form.controls['username'].reset();
      return;
    } else if (form.value.username.length > 12) {
      this._showSnackbar('error', 'Username can maximally be 12 characters');
      form.controls['username'].reset();
      return;
    } else if (this.used) {
      this._showSnackbar('error', 'Username already in use');
      form.controls['username'].reset();
      this.used = false;
      return;
    }
    const newUser: UserAdd = form.value;
    newUser.verified = false;
    this.userService.register(newUser).subscribe({
      next: (res: HttpResponse) => {
        if (res.statusCode === 201) {
          this._showSnackbar('succes', res.message);
          this.dialogRef.close({
            redirect: false,
            message: 'Welcome to the club',
          });
        } else {
          this._showSnackbar('error', 'Email address already in use');
        }
      },
      error: (res: HttpResponse) => {
        form.reset();
        this._showSnackbar('error', res.message);
      },
    });
  }

  onLogin(): void {
    this.dialogRef.close({ redirect: true });
  }

  _checkUsername(username: string) {
    if (username.length < 4) {
      this.used = undefined;
      return;
    }
    this.userService.checkIfUsernameIsUsed({ username }).subscribe(
      (res: HttpResponse) => {
        res.statusCode === 200 ? (this.used = false) : (this.used = true);
      },
      (res: HttpResponse) => {
        this._showSnackbar('error', res.message);
      }
    );
  }

  _changeInputType(): void {
    if (this.inputType === 'password') {
      this.inputType = 'text';
      this.inputIcon = 'pi pi-eye-slash';
    } else {
      this.inputType = 'password';
      this.inputIcon = 'pi pi-eye';
    }
  }

  _showSnackbar(severity: string, detail: string): void {
    this.messageService.add({
      severity,
      detail,
    });
  }
}
