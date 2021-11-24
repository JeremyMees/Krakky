import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MessageService } from 'primeng/api';
import { HttpResponse } from 'src/app/shared/models/http-response.model';
import { UserAdd } from 'src/app/user/models/add_user.model';
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

  public onRegister(form: NgForm): void {
    if (this._validateInputs(form)) {
      const newUser: UserAdd = form.value;
      newUser.verified = false;
      newUser.img = newUser.username;
      newUser.img_query = '?mouth=laughing';
      this.userService.register(newUser).subscribe({
        next: (res: HttpResponse) => {
          if (res.statusCode === 201) {
            this._showSnackbar('succes', res.message);
            this.dialogRef.close({
              redirect: false,
              message: 'Welcome to the club',
              data: { email: newUser.email, password: newUser.password },
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
    } else {
      return;
    }
  }

  public onLogin(): void {
    this.dialogRef.close({ redirect: true });
  }

  private _validateInputs(form: NgForm): boolean {
    if (form.invalid) {
      form.reset();
      this._showSnackbar('error', "Form wasn't filled correctly");
      return false;
    } else if (form.value.password.length < 6) {
      this._showSnackbar('error', 'Password need to be at least 6 characters');
      form.controls['password'].reset();
      return false;
    } else if (!/\d/.test(form.value.password)) {
      this._showSnackbar(
        'error',
        'Password needs to contain at least 1 number'
      );
      form.controls['password'].reset();
      return false;
    } else if (form.value.username.length < 4) {
      this._showSnackbar('error', 'Username need to be at least 4 characters');
      form.controls['username'].reset();
      return false;
    } else if (form.value.username.length > 12) {
      this._showSnackbar('error', 'Username can maximally be 12 characters');
      form.controls['username'].reset();
      return false;
    } else if (this.used) {
      this._showSnackbar('error', 'Username already in use');
      form.controls['username'].reset();
      this.used = false;
      return false;
    } else {
      return true;
    }
  }

  public checkUsername(username: string) {
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
