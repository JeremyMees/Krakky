import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpResponse } from 'src/app/shared/models/http-response.model';
import { LoginCredentials } from '../../login/models/login-credentials.model';
import { map } from 'rxjs/operators';
import { User } from 'src/app/user/models/user.model';
import { AuthData } from './models/auth-data.model';
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
  current_user = new BehaviorSubject<User | null>(null);
  constructor(private http: HttpClient, private router: Router) {}

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
        map((res) => {
          if (res.statusCode === 200) {
            this.token = res.data.acces_token;
            const expiresInDuration: number =
              res.data.token_expires_time - Date.now();
            this._setAuthTimer(expiresInDuration);
            this.auth_status_listener$.next(true);
            this.user_id = res.data._id;
            this.user_email = res.data.email;
            this.username = res.data.username;
            this._saveAuthData(`${expiresInDuration}`);
          }
          return res;
        })
      );
  }

  public logoutUser(): void {
    this.token = undefined;
    this.is_authenticated = false;
    this.auth_status_listener$.next(false);
    this.user_email = undefined;
    clearTimeout(this.token_timer);
    this._clearAuthData();
    this.user_id = undefined;
    this.current_user.next(null);
    this.router.navigate(['/home']);
  }

  private _setAuthTimer(duration: number): void {
    this.token_timer = setTimeout(() => {
      this.logoutUser();
    }, duration);
  }

  _saveAuthData(expires_in: string): void {
    this.current_user.next({
      email: this.user_email as string,
      _id: this.user_id as string,
      username: this.username as string,
    });
    console.log('test', this.token);
    localStorage.setItem('token', this.token as string);
    localStorage.setItem('expiration', expires_in as string);
    localStorage.setItem('userId', this.user_id as string);
    localStorage.setItem('userEmail', this.user_email as string);
    localStorage.setItem('username', this.username as string);
  }

  private _clearAuthData(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('username');
  }

  private _getAuthData(): AuthData | undefined {
    const auth_data: AuthData = {
      token: localStorage.getItem('token') as string,
      expiration_date: Number(localStorage.getItem('expiration')),
      user_id: localStorage.getItem('userId') as string,
      user_email: localStorage.getItem('userEmail') as string,
      username: localStorage.getItem('username') as string,
    };
    if (!auth_data.token || !auth_data.expiration_date) {
      return;
    }
    return auth_data;
  }
}
