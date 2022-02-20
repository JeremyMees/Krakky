import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpResponse } from 'src/app/shared/models/http-response.model';
import { User } from 'src/app/user/models/user.model';
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
  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const user = this.userService.onGetCurrentUser().value as User;
    return this.workspaceService
      .checkIfMember({
        user_id: user._id as string,
        workspace_id: route.params.id,
      })
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
