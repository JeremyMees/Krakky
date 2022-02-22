import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpResponse } from 'src/app/shared/models/http-response.model';
import { environment } from 'src/environments/environment.prod';
import { IfMemberWorkspace } from '../models/check-if-member-workspace.model';
import { Member } from '../models/member.model';
import { Workspace } from '../models/workspace.model';

@Injectable({
  providedIn: 'root',
})
export class WorkspaceService {
  constructor(private http: HttpClient) {}

  public getWorkspaces(id: string): Observable<HttpResponse> {
    return this.http.get<HttpResponse>(
      `${environment.base_url}/workspace?workspace_id=${id}`
    );
  }

  public getAggregatedWorkspace(id: string): Observable<HttpResponse> {
    return this.http.get<HttpResponse>(
      `${environment.base_url}/workspace/aggregated?workspace_id=${id}`
    );
  }

  public getAggregatedWorkspaces(user_id: string): Observable<HttpResponse> {
    return this.http.get<HttpResponse>(
      `${environment.base_url}/workspace/aggregated?member=${user_id}`
    );
  }

  public deleteWorkspace(id: string): Observable<HttpResponse> {
    return this.http.delete<HttpResponse>(
      `${environment.base_url}/workspace/${id}`
    );
  }

  public updateWorkspace(workspace: Workspace): Observable<HttpResponse> {
    return this.http.patch<HttpResponse>(
      `${environment.base_url}/workspace`,
      workspace
    );
  }

  public addWorkspace(workspace: Workspace): Observable<HttpResponse> {
    return this.http.post<HttpResponse>(
      `${environment.base_url}/workspace`,
      workspace
    );
  }

  public getMembersInfo(members: Array<Member>): Observable<HttpResponse> {
    return this.http.post<HttpResponse>(
      `${environment.base_url}/workspace/members`,
      members
    );
  }

  public checkIfMember(payload: IfMemberWorkspace): Observable<HttpResponse> {
    return this.http.post<HttpResponse>(
      `${environment.base_url}/workspace/is_member`,
      payload
    );
  }

  public getWorkspacesFromMember(user_id: string): Observable<HttpResponse> {
    return this.http.get<HttpResponse>(
      `${environment.base_url}/workspace?member=${user_id}`
    );
  }
}
