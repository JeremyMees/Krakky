import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/services/auth.service';
import { HttpResponse } from 'src/app/shared/models/http-response.model';
import { User } from 'src/app/user/models/user.model';
import { UserService } from 'src/app/user/services/user.service';

@Component({
  selector: 'app-verify-user',
  templateUrl: './verify-user.component.html',
  styleUrls: ['./verify-user.component.scss'],
  providers: [MessageService],
})
export class VerifyUserComponent implements OnInit, OnDestroy {
  loginForm!: FormGroup;
  destroy$: Subject<boolean> = new Subject();
  inputType: string = 'password';
  inputIcon: string = 'pi pi-eye';
  user_id?: string;
  logged_in: boolean = true;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private messageService: MessageService,
    private route: ActivatedRoute,
    public router: Router
  ) {}

  public ngOnInit(): void {
    this._onGetParamId();
    this._onSetLoginForm();
  }

  public ngOnDestroy(): void {
    this.destroy$.next(true);
  }

  private _onGetParamId(): void {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      if (params.id) {
        this._onGetCurrentUser();
      } else {
        this.router.navigateByUrl('home');
      }
    });
  }

  private _onGetCurrentUser(): void {
    this.userService
      .onGetUser()
      .pipe(take(1))
      .subscribe((res: HttpResponse) => {
        if (res.statusCode === 200) {
          let user: User = res.data;
          user.verified = true;
          this._onVerifyUser(user);
        } else {
          this.logged_in = false;
        }
      });
  }

  public onLogin(form: FormGroup): void {
    if (form.invalid) {
      form.reset();
      this._showSnackbar('error', "Form wasn't filled correctly");
      return;
    }
    this.authService
      .login(form.value)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: HttpResponse) => {
          if (res.statusCode === 200) {
            this._onGetCurrentUser();
          } else {
            form.reset();
            this._showSnackbar('error', 'Password or email address incorrect');
          }
        },
        error: () => {
          form.reset();
          this._showSnackbar('error', "Error couldn't log in");
        },
      });
  }

  private _onVerifyUser(user: User): void {
    this.userService
      .onVerify(user._id!)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: HttpResponse) => {
          if (res.statusCode === 200) {
            this._showSnackbar('info', 'User successfully verified');
            const user = this.userService.onGetCurrentUser().value;
            user!.verified = true;
            this.userService.onSetCurrentUser(user);
          } else {
            this._showSnackbar('error', "User doesn't exist");
            this.router.navigateByUrl('home');
          }
        },
        error: () => {
          this._showSnackbar('error', "Error couldn't verify user");
        },
      });
  }

  private _onSetLoginForm(): void {
    this.loginForm = this.formBuilder.group(
      {
        email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required],
      },
      { updateOn: 'submit' }
    );
  }

  public onChangeInputType(): void {
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
