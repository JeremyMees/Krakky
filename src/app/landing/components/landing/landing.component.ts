import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { User } from 'src/app/user/models/user.model';
import { UserService } from 'src/app/user/services/user.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
  providers: [MessageService],
})
export class LandingComponent implements OnInit, OnDestroy {
  user: User | undefined;
  destroy$: Subject<boolean> = new Subject();

  constructor(
    private router: Router,
    private userService: UserService,
    private messageService: MessageService
  ) {}

  public ngOnInit(): void {
    this.userService
      .onGetCurrentUser()
      .pipe(takeUntil(this.destroy$))
      .subscribe((user) => {
        this.user = user as User;
      });
  }

  public ngOnDestroy(): void {
    this.destroy$.next(true);
  }

  public onRouteToWorkspace(): void {
    if (this.user) {
      this.router.navigateByUrl('workspace');
    } else {
      this._showSnackbar(
        'info',
        'Before creating a workspace you must be logged in'
      );
    }
  }

  private _showSnackbar(severity: string, detail: string): void {
    this.messageService.add({
      severity,
      detail,
    });
  }
}
