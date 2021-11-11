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

  public onLogin(form: NgForm): void {
    if (form.invalid) {
      form.reset();
      this._showSnackbar('error', "Form wasn't filled correctly");
      return;
    }
    this.authService.login(form.value).subscribe({
      next: (res: HttpResponse) => {
        if (res.statusCode === 200) {
          this._showSnackbar('succes', res.message);
          this.dialogRef.close({
            redirect: false,
            message: res.message,
            data: res.data,
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

  public onChangeToResetPassword(form: NgForm): void {
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

  public onRegister(): void {
    this.dialogRef.close({ redirect: true });
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
