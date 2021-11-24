import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpResponse } from 'src/app/shared/models/http-response.model';
import { GetApiKey } from '../models/get-api-key.model';
import { HttpClient } from '@angular/common/http';
import { UpdateUserImg } from '../models/update-img.model';
@Injectable({
  providedIn: 'root',
})
export class AccountService {
  constructor(private http: HttpClient) {}

  public getApiKey(payload: GetApiKey): Observable<HttpResponse> {
    return this.http.post<HttpResponse>(`http://localhost:3000/api`, payload);
  }

  public createApiKey(payload: GetApiKey): Observable<HttpResponse> {
    return this.http.post<HttpResponse>(
      `http://localhost:3000/api/create`,
      payload
    );
  }

  public updateUserImage(user: UpdateUserImg): Observable<HttpResponse> {
    return this.http.patch<HttpResponse>(
      'http://localhost:3000/users/img',
      user
    );
  }
}
