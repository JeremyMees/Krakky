import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { take } from 'rxjs/operators';
import { containsNumberValidator } from 'src/app/shared/directives/contains-number/contains-number.directive';
import { HttpResponse } from 'src/app/shared/models/http-response.model';
import { ResetPassword } from '../../models/reset-password.model';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
  providers: [MessageService],
})
export class ResetPasswordComponent implements OnInit {
  token!: string;
  inputType: string = 'password';
  inputIcon: string = 'pi pi-eye';
  resetForm!: FormGroup;

  constructor(
    private messageService: MessageService,
    public router: Router,
    private userService: UserService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder
  ) {}

  public ngOnInit(): void {
    this._onSetForm();
    this._onGetParamId();
  }

  public onResetPassword(form: FormGroup): void {
    if (form.invalid) {
      this._showSnackbar('error', "Form wasn't filled correctly");
      form.reset();
      return;
    }
    const reset: ResetPassword = { ...form.value, token: this.token };
    this.userService
      .onResetPassword(reset)
      .pipe(take(1))
      .subscribe({
        next: (res: HttpResponse) => {
          if (res.statusCode === 200) {
            this._showSnackbar('info', 'Reset password successfully');
            setTimeout(() => {
              this.router.navigateByUrl('home');
            }, 2000);
          } else {
            this._showSnackbar('info', "User doesn't exist");
          }
        },
        error: () => {
          this._showSnackbar('error', "Couldn't reset password");
        },
      });
  }

  private _onGetParamId(): void {
    this.route.params.pipe(take(1)).subscribe((params) => {
      if (params.token) {
        this.token = params.token.split('_').join('/');
      } else {
        this.router.navigateByUrl('home');
      }
    });
  }

  public onGoBack(): void {
    this.router.navigateByUrl('home');
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

  private _onSetForm(): void {
    this.resetForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(20),
          containsNumberValidator,
        ],
      ],
    });
  }

  private _showSnackbar(severity: string, detail: string): void {
    this.messageService.add({
      severity,
      detail,
    });
  }
}
