import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MessageService } from 'primeng/api';
import { containsNumberValidator } from 'src/app/shared/directives/contains-number/contains-number.directive';
import { PrivacyComponent } from 'src/app/shared/modals/privacy/privacy.component';
import { TermsComponent } from 'src/app/shared/modals/terms/terms.component';
import { HttpResponse } from 'src/app/shared/models/http-response.model';
import { UserAdd } from 'src/app/user/models/add_user.model';
import { UserService } from '../../../user/services/user.service';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  providers: [MessageService],
})
export class RegisterComponent implements OnInit {
  used: boolean | undefined;
  inputType: string = 'password';
  inputIcon: string = 'pi pi-eye';
  registerForm!: FormGroup;
  terms_accept: boolean = false;
  privacy_accept: boolean = false;

  constructor(
    private messageService: MessageService,
    private dialogRef: MatDialogRef<RegisterComponent>,
    private userService: UserService,
    public dialog: MatDialog,
    private formBuilder: FormBuilder
  ) {}

  public ngOnInit(): void {
    this._onSetForm();
  }

  public onRegister(form: FormGroup): void {
    if (form.invalid) {
      this._showSnackbar('error', "Form wasn't filled correctly");
      form.reset();
      return;
    }
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
      error: () => {
        form.reset();
        this._showSnackbar('error', "Error couldn't register");
      },
    });
  }

  public onLogin(): void {
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

  public openDialogTerms(): void {
    this.dialog.open(TermsComponent, { autoFocus: false });
  }

  public openDialogPrivacy(): void {
    this.dialog.open(PrivacyComponent, { autoFocus: false });
  }

  private _onSetForm(): void {
    this.registerForm = this.formBuilder.group({
      username: [
        '',
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(12),
        ],
      ],
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
      marketing: [true],
    });
  }

  private _showSnackbar(severity: string, detail: string): void {
    this.messageService.add({
      severity,
      detail,
    });
  }
}
