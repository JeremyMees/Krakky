import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { HttpResponse } from 'src/app/shared/models/http-response.model';
import { Workspace } from '../models/workspace.model';

@Injectable({
  providedIn: 'root',
})
export class WorkspaceService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  public getWorkspaces(id: string): Observable<HttpResponse> {
    return this.http.get<HttpResponse>(
      `http://localhost:3000/workspace?id=${id}`
    );
  }

  public getAggregatedWorkspaces(user_id: string): Observable<HttpResponse> {
    return this.http.get<HttpResponse>(
      `http://localhost:3000/workspace/aggregated?member=${user_id}`,
      { headers: { Authorization: 'Bearer ' + this.authService.getToken() } }
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
}
