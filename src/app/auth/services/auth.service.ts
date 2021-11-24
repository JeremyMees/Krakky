import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpResponse } from 'src/app/shared/models/http-response.model';
import { LoginCredentials } from '../../login/models/login-credentials.model';
import { map } from 'rxjs/operators';
import { User } from 'src/app/user/models/user.model';
import { AuthData } from './models/auth-data.model';
import { UserService } from 'src/app/user/services/user.service';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  is_authenticated = false;
  token: string | undefined;
  user_id: string | undefined;
  user_email: string | undefined;
  username: string | undefined;
  auth_status_listener$ = new BehaviorSubject<boolean>(false);
  token_timer: any;
  storage = window.localStorage;
  constructor(
    private http: HttpClient,
    private router: Router,
    private userService: UserService
  ) {}

  public getToken(): string {
    return this.token as string;
  }

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
            this.token = res.data.acces_token;
            const expiresInDuration: number =
              res.data.token_expire_time - Date.now();
            this._setAuthTimer(expiresInDuration);
            this.auth_status_listener$.next(true);
            this.user_id = res.data._id;
            this.user_email = res.data.email;
            this.username = res.data.username;
            this.is_authenticated = true;
            this.saveAuthData(res.data);
          }
          return res;
        })
      );
  }

  public autoLogin(): void {
    const user: AuthData = this.getAuthData();
    this.token = user.acces_token;
    this.is_authenticated = true;
    this.user_id = user._id;
    this.user_email = user.email;
    this.username = user.username;
    this.userService.setCurrentUser({
      _id: user._id,
      email: user.email,
      username: user.username,
      img: user.img,
      img_query: user.img_query,
    });
    const expires_in = user.token_expire_time - Date.now();
    this._setAuthTimer(expires_in);
    this.auth_status_listener$.next(true);
  }

  public logout(): void {
    this.token = undefined;
    this.is_authenticated = false;
    this.auth_status_listener$.next(false);
    this.user_email = undefined;
    clearTimeout(this.token_timer);
    this._clearAuthData();
    this.user_id = undefined;
    this.userService.setCurrentUser(null);
    this.router.navigateByUrl('home');
  }

  private _setAuthTimer(duration: number): void {
    this.token_timer = setTimeout(() => {
      this.logout();
    }, duration);
  }

  public saveAuthData(user: User): void {
    this.userService.setCurrentUser({
      _id: user._id,
      email: user.email,
      username: user.username,
      img: user.img,
      img_query: user.img_query,
    });
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token_expiration', `${user.token_expire_time}`);
  }

  private _clearAuthData(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('token_expiration');
  }

  public getAuthData(): AuthData {
    const user = JSON.parse(localStorage.getItem('user') as string);
    if (0 > user.token_expire_time - Date.now()) {
      user.valid_token = false;
      this.is_authenticated = false;
    } else {
      user.valid_token = true;
      this.is_authenticated = true;
    }
    return user;
  }
}
