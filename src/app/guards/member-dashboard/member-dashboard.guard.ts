import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { DashboardService } from 'src/app/dashboard/service/dashboard.service';
import { HttpResponse } from 'src/app/shared/models/http-response.model';
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

  async canActivate(route: ActivatedRouteSnapshot): Promise<boolean> {
    const current_user = await this.userService
      .onGetUser()
      .toPromise()
      .then((res: HttpResponse) => {
        if (res.statusCode === 200) {
          return res.data;
        } else {
          this.router.navigateByUrl('home');
        }
      });
    return this.dashboardService
      .getDashboard(route.params.id)
      .toPromise()
      .then((res: HttpResponse) => {
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
      })
      .catch(() => {
        this.router.navigateByUrl('notmember');
        return false;
      });
  }
}
