import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpResponse } from 'src/app/shared/models/http-response.model';
import { environment } from 'src/environments/environment';
import { CreateMemberToken } from '../models/create-member-token.model';
import { UpdateMember } from '../models/update-member.model';

@Injectable({
  providedIn: 'root',
})
export class TeamService {
  constructor(private http: HttpClient) {}

  public addMember(payload: CreateMemberToken): Observable<HttpResponse> {
    return this.http.post<HttpResponse>(
      `${environment.base_url}/workspace/create_token`,
      payload
    );
  }

  public updateMember(payload: UpdateMember): Observable<HttpResponse> {
    return this.http.patch<HttpResponse>(
      `${environment.base_url}/workspace/member`,
      payload
    );
  }

  public deleteMember(
    workspace_id: string,
    user_id: string
  ): Observable<HttpResponse> {
    return this.http.delete<HttpResponse>(
      `${environment.base_url}/workspace/member/${workspace_id}/${user_id}`
    );
  }
}
