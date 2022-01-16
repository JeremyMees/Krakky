import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MessageService } from 'primeng/api';
import { HttpResponse } from 'src/app/shared/models/http-response.model';
import { AuthService } from '../../../auth/services/auth.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [MessageService],
})
export class LoginComponent implements OnInit {
  inputType: string = 'password';
  inputIcon: string = 'pi pi-eye';
  forgotPassword: boolean = false;
  loginForm!: FormGroup;
  resetForm!: FormGroup;
  constructor(
    private authService: AuthService,
    private messageService: MessageService,
    private dialogRef: MatDialogRef<LoginComponent>,
    private formBuilder: FormBuilder
  ) {}

  public ngOnInit(): void {
    this._onSetLoginForm();
    this._onSetResetForm();
  }

  private _onSetLoginForm(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  private _onSetResetForm(): void {
    this.resetForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  public onLogin(form: FormGroup): void {
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
        this._showSnackbar('error', "Error couldn't log in");
      },
    });
  }

  public onChangeToResetPassword(form: FormGroup): void {
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
