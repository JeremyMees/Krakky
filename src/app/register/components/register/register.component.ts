import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MessageService } from 'primeng/api';
import { CharacterService } from 'src/app/account/services/character.service';
import { containsNumberValidator } from 'src/app/shared/directives/contains-number/contains-number.directive';
import { CharacterEditorComponent } from 'src/app/shared/modals/character-editor/character-editor.component';
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
  img_query!: string;

  constructor(
    private messageService: MessageService,
    private dialogRef: MatDialogRef<RegisterComponent>,
    private userService: UserService,
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private characterService: CharacterService
  ) {}

  public ngOnInit(): void {
    this._onSetForm();
    this.onRandomizeAvatar();
  }

  public onRegister(form: FormGroup): void {
    if (form.invalid) {
      this._showSnackbar('error', "Form wasn't filled correctly");
      form.reset();
      return;
    }
    const newUser: UserAdd = form.value;
    newUser.verified = false;
    newUser.img = 'krakky';
    newUser.img_query = this.img_query;
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

  public onRandomizeAvatar(): void {
    this.img_query = this.characterService.generateRandomAvatar();
  }

  public onOpenAvatarEditor(): void {
    const dialog_ref = this.dialog.open(CharacterEditorComponent, {
      width: '100%',
      maxWidth: '600px',
      data: { img_query: this.img_query },
    });
    dialog_ref.afterClosed().subscribe((result: string) => {
      this.img_query = result;
    });
  }

  private _showSnackbar(severity: string, detail: string): void {
    this.messageService.add({
      severity,
      detail,
    });
  }
}
