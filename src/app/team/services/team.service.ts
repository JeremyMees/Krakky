import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpResponse } from 'src/app/shared/models/http-response.model';
import { CreateMemberToken } from '../models/create-member-token.model';
import { UpdateMember } from '../models/update-member.model';

@Injectable({
  providedIn: 'root',
})
export class TeamService {
  constructor(private http: HttpClient) {}

  public updateMember(payload: UpdateMember): Observable<HttpResponse> {
    return this.http.patch<HttpResponse>(
      'http://localhost:3000/workspace/member',
      payload
    );
  }

  public addMember(payload: CreateMemberToken): Observable<HttpResponse> {
    return this.http.post<HttpResponse>(
      'http://localhost:3000/workspace/create_token',
      payload
    );
  }
}
