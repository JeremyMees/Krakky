import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map, take } from 'rxjs/operators';
import { HttpResponse } from 'src/app/shared/models/http-response.model';
import { UserService } from 'src/app/user/services/user.service';

@Injectable({
  providedIn: 'root',
})
export class NotVerifiedGuard implements CanActivate {
  constructor(private userService: UserService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.userService.onGetUser().pipe(
      take(1),
      map((res: HttpResponse) => {
        if (res.statusCode === 200) {
          if (res.data.verified) {
            return false;
          } else {
            return true;
          }
        } else {
          return true;
        }
      }),
      catchError(() => {
        return of(false);
      })
    );
  }
}
