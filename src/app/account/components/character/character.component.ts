import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MessageService } from 'primeng/api';
import { AuthData } from 'src/app/auth/services/models/auth-data.model';
import { HttpResponse } from 'src/app/shared/models/http-response.model';
import { User } from 'src/app/user/models/user.model';
import { UserService } from 'src/app/user/services/user.service';
import { CUSTOM_CHARACTER } from '../../data/custom-character';
import { CustomCharacter } from '../../models/character-customization.model';
import { Character } from '../../models/character.model';
import { AccountService } from '../../services/account.service';

@Component({
  selector: 'app-character',
  templateUrl: './character.component.html',
  styleUrls: ['./character.component.scss'],
  providers: [MessageService],
})
export class CharacterComponent {
  img!: string;
  img_query!: string;
  queryObj: Character = {};
  customCharacter: CustomCharacter = CUSTOM_CHARACTER;

  constructor(
    private dialogRef: MatDialogRef<CharacterComponent>,
    @Inject(MAT_DIALOG_DATA) public data: User,
    private cdRef: ChangeDetectorRef,
    private accountService: AccountService,
    private messageService: MessageService,
    private userService: UserService
  ) {
    this.img = data.img as string;
    this.img_query = data.img_query as string;
  }

  public randomize(): void {
    const random_string = (Math.random() + 1).toString(36).substring(7);
    this.img = random_string;
    this.img_query = '';
    this.queryObj = {};
    this.cdRef.detectChanges();
  }

  private _setQuery(): void {
    this.img_query = '?';
    for (const [key, value] of Object.entries(this.queryObj)) {
      this.img_query += `${key}=${value}&`;
    }
    this.img_query = this.img_query.slice(0, -1);
    this.cdRef.detectChanges();
  }

  public changeCharacter(change: string): void {
    switch (change) {
      case 'glasses':
        this.queryObj.glassesProbability = '100';
        break;
      case 'facialHair':
        this.queryObj.facialHairProbability = '100';
        break;
    }
    if (this.queryObj[change]) {
      const index: number = this.customCharacter[change].indexOf(
        this.queryObj[change]
      );
      if (index === -1) {
        this.queryObj[change] = this.customCharacter[change][0];
      } else {
        this.customCharacter[change].length === index + 1
          ? (this.queryObj[change] = this.customCharacter[change][0])
          : (this.queryObj[change] = this.customCharacter[change][index + 1]);
      }
    } else {
      this.queryObj[change] = this.customCharacter[change][0];
    }
    this._setQuery();
  }

  public deleteCharacterTrade(change: string, probability: string): void {
    if (this.queryObj[change]) {
      delete this.queryObj[change];
      this.queryObj[probability] = '0';
    }
    this._setQuery();
  }

  public saveAvatar(): void {
    this.accountService
      .updateUserImage({
        img: this.img,
        img_query: this.img_query,
        _id: this.data._id as string,
      })
      .subscribe({
        next: (data: HttpResponse) => {
          if (data.statusCode === 200) {
            this.data.img = this.img;
            this.data.img_query = this.img_query;
            this.userService.setCurrentUser(this.data);
            let localstorage_item: AuthData = JSON.parse(
              localStorage.getItem('user') as string
            );
            localstorage_item.img = this.img;
            localstorage_item.img_query = this.img_query;
            localStorage.setItem('user', JSON.stringify(localstorage_item));
            this.dialogRef.close();
          } else {
            this._showSnackbar('error', `Couldn't update avatar`);
          }
        },
        error: () => {
          this._showSnackbar('error', `Couldn't update avatar`);
        },
      });
  }

  public goBack(): void {
    this.dialogRef.close();
  }

  private _showSnackbar(severity: string, detail: string): void {
    this.messageService.add({
      severity,
      detail,
    });
  }
}
