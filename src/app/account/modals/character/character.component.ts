import {
  ChangeDetectorRef,
  Component,
  Inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { HttpResponse } from 'src/app/shared/models/http-response.model';
import { User } from 'src/app/user/models/user.model';
import { UserService } from 'src/app/user/services/user.service';
import { CUSTOM_CHARACTER } from '../../data/custom-character';
import { CustomCharacter } from '../../models/character-customization.model';
import { Character } from '../../models/character.model';
import { CharacterService } from '../../services/character.service';

@Component({
  selector: 'app-character',
  templateUrl: './character.component.html',
  styleUrls: ['./character.component.scss'],
  providers: [MessageService],
})
export class CharacterComponent implements OnInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject();
  user!: User;
  img!: string;
  img_query!: string;
  query_obj: Character = {};
  custom_character: CustomCharacter = CUSTOM_CHARACTER;

  constructor(
    private dialogRef: MatDialogRef<CharacterComponent>,
    @Inject(MAT_DIALOG_DATA) public data: User,
    private cdRef: ChangeDetectorRef,
    private messageService: MessageService,
    private userService: UserService,
    private characterService: CharacterService
  ) {}

  public ngOnInit(): void {
    this.img = this.data.img as string;
    this.img_query = this.data.img_query as string;
    this._onBuildQueryObj(this.data.img_query as string);
  }

  public ngOnDestroy(): void {
    this.destroy$.next(true);
  }

  public randomize(): void {
    const query: string = this.characterService.generateRandomAvatar();
    this.img_query = query;
    this._onBuildQueryObj(query);
    this.cdRef.detectChanges();
  }

  private _onBuildQueryObj(query: string): void {
    const trades: Array<string> = query.slice(1).split('&');
    let query_obj: { [key: string]: string } = {};
    trades.forEach((trade: string) => {
      const trade_value: Array<string> = trade.split('=');
      query_obj[trade_value[0]] = trade_value[1];
    });
    this.query_obj = query_obj;
  }

  private _setQuery(): void {
    this.img_query = '?';
    for (const [key, value] of Object.entries(this.query_obj)) {
      this.img_query += `${key}=${value}&`;
    }
    this.img_query = this.img_query.slice(0, -1);
    this.cdRef.detectChanges();
  }

  public changeCharacter(change: string): void {
    switch (change) {
      case 'glasses':
        this.query_obj.glassesProbability = '100';
        break;
      case 'earrings':
        this.query_obj.earringsProbability = '100';
        break;
    }
    if (this.query_obj[change]) {
      const index: number = this.custom_character[change].indexOf(
        this.query_obj[change]
      );
      if (index === -1) {
        this.query_obj[change] = this.custom_character[change][0];
      } else {
        this.custom_character[change].length === index + 1
          ? (this.query_obj[change] = this.custom_character[change][0])
          : (this.query_obj[change] = this.custom_character[change][index + 1]);
      }
    } else {
      this.query_obj[change] = this.custom_character[change][0];
    }
    this._setQuery();
  }

  public deleteCharacterTrade(change: string, probability: string): void {
    if (this.query_obj[change]) {
      delete this.query_obj[change];
      this.query_obj[probability] = '0';
    }
    this._setQuery();
  }

  public saveAvatar(): void {
    this.characterService
      .updateUserImage({
        img: this.img,
        img_query: this.img_query,
        _id: this.data._id as string,
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: HttpResponse) => {
          if (data.statusCode === 200) {
            this.data.img = this.img;
            this.data.img_query = this.img_query;
            this.userService.onSetCurrentUser(this.data);
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
