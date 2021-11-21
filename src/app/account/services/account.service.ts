import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpResponse } from 'src/app/shared/models/http-response.model';
import { GetApiKey } from '../models/get-api-key.model';
import { HttpClient } from '@angular/common/http';
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
}
