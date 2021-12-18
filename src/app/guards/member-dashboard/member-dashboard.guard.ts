import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { DashboardService } from 'src/app/dashboard/service/dashboard.service';
import { HttpResponse } from 'src/app/shared/models/http-response.model';
import { User } from 'src/app/user/models/user.model';
import { UserService } from 'src/app/user/services/user.service';

@Injectable({
  providedIn: 'root',
})
export class MemberDashboardGuard implements CanActivate {
  constructor(
    private userService: UserService,
    private dashboardService: DashboardService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> | boolean {
    const user = this.userService.getCurrentUser().value as User;
    return this.dashboardService
      .checkIfMember({ user_id: user._id as string, board_id: route.params.id })
      .pipe(
        map((res: HttpResponse) => {
          if (res.data) {
            return true;
          } else {
            this.router.navigateByUrl('notmember');
            return false;
          }
        }),
        catchError(() => {
          this.router.navigateByUrl('notmember');
          return of(false);
        })
      );
  }
}
