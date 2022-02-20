import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { HttpResponse } from 'src/app/shared/models/http-response.model';
import { UserService } from 'src/app/user/services/user.service';
import { WorkspaceService } from 'src/app/workspace/services/workspace.service';

@Injectable({
  providedIn: 'root',
})
export class MemberWorkspaceGuard implements CanActivate {
  constructor(
    private userService: UserService,
    private router: Router,
    private workspaceService: WorkspaceService
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
    return this.workspaceService
      .checkIfMember({
        user_id: current_user._id as string,
        workspace_id: route.params.id,
      })
      .toPromise()
      .then((res: HttpResponse) => {
        if (res.data) {
          return true;
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
