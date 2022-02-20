import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { DashboardService } from 'src/app/dashboard/service/dashboard.service';
import { HttpResponse } from 'src/app/shared/models/http-response.model';
import { User } from 'src/app/user/models/user.model';
import { UserService } from 'src/app/user/services/user.service';
import { Member } from 'src/app/workspace/models/member.model';

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
    const current_user = this.userService.onGetCurrentUser().value as User;
    return this.dashboardService.getDashboard(route.params.id).pipe(
      map((res: HttpResponse) => {
        if (res.data) {
          const user: Member = res.data[0].team.filter(
            (team: Member) => team._id === current_user._id
          )[0];
          if (res.data[0].private) {
            if (user) {
              return true;
            } else {
              this.router.navigateByUrl('notmember');
              return false;
            }
          } else {
            return true;
          }
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
