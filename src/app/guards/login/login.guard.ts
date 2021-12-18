import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class LoginGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  public canActivate(): boolean {
    if (this.authService.getIsAuth()) {
      return true;
    } else {
      this.router.navigateByUrl('home');
      return false;
    }
  }
}
