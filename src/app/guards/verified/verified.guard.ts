import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map, take } from 'rxjs/operators';
import { HttpResponse } from 'src/app/shared/models/http-response.model';
import { User } from 'src/app/user/models/user.model';
import { UserService } from 'src/app/user/services/user.service';

@Injectable({
  providedIn: 'root',
})
export class VerifiedGuard implements CanActivate {
  constructor(private userService: UserService, private router: Router) {}

  canActivate(): Observable<boolean> {
    const user: User = this.userService.onGetCurrentUser().value as User;
    if (user) {
      if (user.verified) {
        return of(true);
      } else {
        this.router.navigateByUrl('notverified');
        return of(false);
      }
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
