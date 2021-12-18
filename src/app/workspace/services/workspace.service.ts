import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpResponse } from 'src/app/shared/models/http-response.model';
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
      `http://localhost:3000/workspace?workspace_id=${id}`
    );
  }

  public getAggregatedWorkspace(id: string): Observable<HttpResponse> {
    return this.http.get<HttpResponse>(
      `http://localhost:3000/workspace/aggregated?workspace_id=${id}`
    );
  }

  public getAggregatedWorkspaces(user_id: string): Observable<HttpResponse> {
    return this.http.get<HttpResponse>(
      `http://localhost:3000/workspace/aggregated?member=${user_id}`
    );
  }

  public deleteWorkspace(id: string): Observable<HttpResponse> {
    return this.http.delete<HttpResponse>(
      `http://localhost:3000/workspace/${id}`
    );
  }

  public updateWorkspace(workspace: Workspace): Observable<HttpResponse> {
    return this.http.patch<HttpResponse>(
      `http://localhost:3000/workspace`,
      workspace
    );
  }

  public addWorkspace(workspace: Workspace): Observable<HttpResponse> {
    return this.http.post<HttpResponse>(
      `http://localhost:3000/workspace`,
      workspace
    );
  }

  public getMembersInfo(members: Array<Member>): Observable<HttpResponse> {
    return this.http.post<HttpResponse>(
      `http://localhost:3000/workspace/members`,
      members
    );
  }

  public checkIfMember(payload: IfMemberWorkspace): Observable<HttpResponse> {
    return this.http.post<HttpResponse>(
      `http://localhost:3000/workspace/is_member`,
      payload
    );
  }
}
