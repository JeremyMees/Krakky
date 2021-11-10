import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MessageService } from 'primeng/api';
import { HttpResponse } from 'src/app/shared/models/http-response.model';
import { AuthService } from '../../auth/services/auth.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [MessageService],
})
export class LoginComponent {
  inputType: string = 'password';
  inputIcon: string = 'pi pi-eye';
  forgotPassword: boolean = false;
  constructor(
    private authService: AuthService,
    private messageService: MessageService,
    private dialogRef: MatDialogRef<LoginComponent>
  ) {}

  onLogin(form: NgForm): void {
    if (form.invalid) {
      form.reset();
      this._showSnackbar('error', "Form wasn't filled correctly");
      return;
    }
    this.authService.login(form.value).subscribe({
      next: (res: HttpResponse) => {
        if (res.statusCode === 200) {
          this._showSnackbar('succes', res.message);
          console.log(res);
          this.dialogRef.close({
            redirect: false,
            message: res.message,
            data: {email:form.value.email},
          });
        } else {
          form.reset();
          this._showSnackbar('error', res.message);
        }
      },
      error: (res: HttpResponse) => {
        form.reset();
        this._showSnackbar('error', res.message);
      },
    });
  }

  onChangeToResetPassword(form: NgForm): void {
    if (form.invalid) {
      form.reset();
      this._showSnackbar('error', "Form wasn't filled correctly");
      return;
    }
    this.dialogRef.close({
      redirect: false,
      message: 'Reset token has been sent successfully',
    });
  }

  onRegister(): void {
    this.dialogRef.close({ redirect: true });
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
