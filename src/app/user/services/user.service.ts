import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpResponse } from 'src/app/shared/models/http-response.model';
import { UserAdd } from '../models/add_user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  register(user: UserAdd): Observable<HttpResponse> {
    return this.http.post<HttpResponse>('http://localhost:3000/users', user);
  }

  checkIfUsernameIsUsed(user: { username: string }): Observable<HttpResponse> {
    return this.http.post<HttpResponse>(
      'http://localhost:3000/users/username',
      user
    );
  }
}
