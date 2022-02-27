import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { UpdateUserSettings } from 'src/app/account/models/update-user-setting.model';
import { HttpResponse } from 'src/app/shared/models/http-response.model';
import { environment } from 'src/environments/environment.prod';
import { UserAdd } from '../models/add_user.model';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  current_user$ = new BehaviorSubject<User | null>(null);
  constructor(private http: HttpClient, private router: Router) {}

  public onGetUser(): Observable<HttpResponse> {
    return this.http.get<HttpResponse>(`${environment.base_url}/auth/profile`);
  }

  public onGetCurrentUser(): BehaviorSubject<User | null> {
    return this.current_user$;
  }

  public onSetCurrentUser(user: User | null): void {
    this.current_user$.next(user);
  }

  public onUpdateUser(user: {
    [key: string]: string;
  }): Observable<HttpResponse> {
    return this.http.patch<HttpResponse>(`${environment.base_url}/user`, user);
  }

  public onUpdateSettingsUser(
    settings: UpdateUserSettings
  ): Observable<HttpResponse> {
    return this.http.patch<HttpResponse>(
      `${environment.base_url}/user/settings`,
      settings
    );
  }

  public onRegister(user: UserAdd): Observable<HttpResponse> {
    return this.http.post<HttpResponse>(`${environment.base_url}/user`, user);
  }

  public onVerify(id: string): Observable<HttpResponse> {
    return this.http.get<HttpResponse>(
      `${environment.base_url}/user/verify/${id}`
    );
  }

  public onDeleteUser(id: string): Observable<HttpResponse> {
    return this.http
      .delete<HttpResponse>(`${environment.base_url}/user/${id}`)
      .pipe(
        map((res) => {
          this.onSetCurrentUser(null);
          return res;
        })
      );
  }
}
