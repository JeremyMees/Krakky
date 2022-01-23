import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { HttpResponse } from 'src/app/shared/models/http-response.model';
import { Score } from 'src/app/tetris/models/score.model';
import { User } from 'src/app/user/models/user.model';
import { UserService } from 'src/app/user/services/user.service';
import { PageNotFoundService } from '../../services/page-not-found.service';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.scss'],
  providers: [MessageService],
})
export class PageNotFoundComponent implements OnInit, OnDestroy {
  tetris: boolean = false;
  loading: boolean = false;
  scores: Array<Score> = [];
  personal_score: Score | undefined;
  destroy$: Subject<boolean> = new Subject();
  current_user: User | null = null;

  constructor(
    public router: Router,
    private pageNotFoundService: PageNotFoundService,
    private userService: UserService,
    private messageService: MessageService
  ) {}

  public ngOnInit(): void {
    this._onGetCurrentUser();
  }

  public ngOnDestroy(): void {
    this.destroy$.next(true);
  }

  public onTetris(): void {
    this.loading = true;
    this.tetris = true;
    this._onGetPersonalHighscore();
    this._onGetHighscores();
  }

  private _onGetCurrentUser(): void {
    this.userService
      .getCurrentUser()
      .pipe(takeUntil(this.destroy$))
      .subscribe((user) => {
        this.current_user = user;
      });
  }

  private _onGetPersonalHighscore(): void {
    if (this.current_user) {
      this.pageNotFoundService
        .onGetPersonalHighscore(this.current_user._id!)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (res: HttpResponse) => {
            if (res.statusCode === 200) {
              this.personal_score = res.data[0];
            } else {
              this._showSnackbar('error', "Couldn't fetch personal highscore");
            }
          },
          error: () => {
            this._showSnackbar('error', "Couldn't fetch personal highscore");
          },
        });
    }
  }

  private _onGetHighscores(): void {
    this.pageNotFoundService
      .onGetHighscores()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: HttpResponse) => {
          if (res.statusCode === 200) {
            this.scores = res.data;
          } else {
            this._showSnackbar('error', "Couldn't fetch highscores");
          }
          this.loading = false;
        },
        error: () => {
          this._showSnackbar('error', "Couldn't fetch highscores");
          this.loading = false;
        },
      });
  }

  public onHighscore(score: number): void {
    if (this.current_user) {
      const new_score: Score = {
        score,
        username: this.current_user.username!,
        user_id: this.current_user._id!,
      };
      this._onCheckPersonalScore(new_score);
      this._onCheckHighScore(new_score);
      this.pageNotFoundService
        .onAddHighscore(new_score)
        .pipe(takeUntil(this.destroy$))
        .subscribe();
    } else {
      this._showSnackbar(
        'info',
        'Only when a user is logged the score can be saved'
      );
      const new_score: Score = {
        score,
        username: 'you',
        user_id: 'no_id',
      };
      this._onCheckPersonalScore(new_score);
    }
  }

  private _onCheckPersonalScore(new_score: Score): void {
    this.personal_score
      ? this.personal_score.score < new_score.score
        ? (this.personal_score = new_score)
        : undefined
      : (this.personal_score = new_score);
  }

  private _onCheckHighScore(new_score: Score): void {
    const scores: Array<Score> = [...this.scores];
    scores.push(new_score);
    scores.reduce((prev: Score, curr: Score) => {
      return prev.score < curr.score ? prev : curr;
    });
    if (scores.length >= 10) {
      scores.pop();
    }
    this.scores = scores;
  }

  private _showSnackbar(severity: string, detail: string): void {
    this.messageService.add({
      severity,
      detail,
    });
  }
}
