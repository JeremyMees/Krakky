import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpResponse } from 'src/app/shared/models/http-response.model';
import { LoginCredentials } from '../../login/models/login-credentials.model';
import { map, take } from 'rxjs/operators';
import { UserService } from 'src/app/user/services/user.service';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  is_authenticated: boolean = false;
  auth_status_listener$ = new BehaviorSubject<boolean>(false);
  constructor(
    private http: HttpClient,
    private router: Router,
    private userService: UserService
  ) {}

  public getAuthStatusListener(): Observable<boolean> {
    return this.auth_status_listener$.asObservable();
  }

  public getIsAuth(): boolean {
    return this.is_authenticated;
  }

  public login(credentials: LoginCredentials): Observable<HttpResponse> {
    return this.http
      .post<HttpResponse>('http://localhost:3000/auth/login', credentials)
      .pipe(
        map((res: HttpResponse) => {
          if (res.statusCode === 200) {
            this.auth_status_listener$.next(true);
            this.is_authenticated = true;
          }
          return res;
        })
      );
  }

  public autoLogin(): void {
    this.userService
      .onGetUser()
      .pipe(take(1))
      .subscribe({
        next: (res: HttpResponse) => {
          if (res.statusCode === 200) {
            this.is_authenticated = true;
            this.auth_status_listener$.next(true);
            this.userService.onSetCurrentUser(res.data);
          } else {
            this.logout();
          }
        },
        error: () => {
          this.router.navigateByUrl('home');
        },
      });
  }

  public logout(): void {
    this.is_authenticated = false;
    this.auth_status_listener$.next(false);
    this.userService.onSetCurrentUser(null);
    this.router.navigateByUrl('home');
  }

  // private _setAuthTimer(duration: number): void {
  //   this.token_timer = setTimeout(() => {
  //     this.logout();
  //   }, duration);
  // }

  // public saveAuthData(user: User): void {
  //   this.userService.onSetCurrentUser(user);
  //   localStorage.setItem(
  //     'krakky-token',
  //     JSON.stringify({
  //       access_token: user.access_token,
  //       expires_in: user.token_expire_time,
  //     })
  //   );
  // }

  // private _clearAuthData(): void {
  //   localStorage.removeItem('krakky-token');
  // }

  // public getAuthData(): AuthData {
  //   const token = JSON.parse(localStorage.getItem('krakky-token') as string);
  //   if (0 > token.token_expire_time - Date.now()) {
  //     token.valid_token = false;
  //     this.is_authenticated = false;
  //   } else {
  //     token.valid_token = true;
  //     this.is_authenticated = true;
  //   }
  //   return token;
  // }
}
