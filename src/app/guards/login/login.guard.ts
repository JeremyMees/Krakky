import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map, take } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/services/auth.service';
import { HttpResponse } from 'src/app/shared/models/http-response.model';
import { UserService } from 'src/app/user/services/user.service';

@Injectable({
  providedIn: 'root',
})
export class LoginGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private userService: UserService
  ) {}

  public canActivate(): Observable<boolean> {
    if (this.authService.getIsAuth()) {
      return of(true);
    } else {
      return this.userService.onGetUser().pipe(
        take(1),
        map((res: HttpResponse) => {
          if (res.statusCode === 200) {
            return true;
          } else {
            this.router.navigateByUrl('home');
            return false;
          }
        }),
        catchError(() => {
          this.router.navigateByUrl('home');
          return of(false);
        })
      );
    }
  }
}
