import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { User } from 'src/app/user/models/user.model';
import { UserService } from 'src/app/user/services/user.service';

@Injectable({
  providedIn: 'root',
})
export class VerifiedGuard implements CanActivate {
  constructor(private userService: UserService, private router: Router) {}

  canActivate(): boolean {
    const user: User = this.userService.onGetCurrentUser().value as User;
    if (user.verified) {
      return true;
    } else {
      this.router.navigateByUrl('notverified');
      return false;
    }
  }
}
