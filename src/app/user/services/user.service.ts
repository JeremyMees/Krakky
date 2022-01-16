import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UpdateUserSettings } from 'src/app/account/models/update-user-setting.model';
import { HttpResponse } from 'src/app/shared/models/http-response.model';
import { UserAdd } from '../models/add_user.model';
import { UpdateUser } from '../models/update-user.model';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  current_user$ = new BehaviorSubject<User | null>(null);
  constructor(private http: HttpClient) {}

  public getCurrentUser(): BehaviorSubject<User | null> {
    return this.current_user$;
  }

  public setCurrentUser(user: User | null): void {
    this.current_user$.next(user);
  }

  public onUpdateUser(user: {
    [key: string]: string;
  }): Observable<HttpResponse> {
    return this.http.patch<HttpResponse>('http://localhost:3000/user', user);
  }

  public onUpdateSettingsUser(
    settings: UpdateUserSettings
  ): Observable<HttpResponse> {
    return this.http.patch<HttpResponse>(
      'http://localhost:3000/user/settings',
      settings
    );
  }

  public register(user: UserAdd): Observable<HttpResponse> {
    return this.http.post<HttpResponse>('http://localhost:3000/user', user);
  }
}
