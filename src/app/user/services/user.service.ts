import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpResponse } from 'src/app/shared/models/http-response.model';
import { UserAdd } from '../models/add_user.model';
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

  public register(user: UserAdd): Observable<HttpResponse> {
    return this.http.post<HttpResponse>('http://localhost:3000/users', user);
  }

  public checkIfUsernameIsUsed(user: {
    username: string;
  }): Observable<HttpResponse> {
    return this.http.post<HttpResponse>(
      'http://localhost:3000/users/username',
      user
    );
  }
}
