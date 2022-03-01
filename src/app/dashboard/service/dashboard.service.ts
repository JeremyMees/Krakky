import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpResponse } from 'src/app/shared/models/http-response.model';
import { environment } from 'src/environments/environment';
import { AddDashboard } from '../models/add-dashboard.model';
import { Dashboard } from '../models/dashboard.model';
import { IfMemberDashboard } from '../models/if-member-dashboard.model';
@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  constructor(private http: HttpClient) {}

  public addDashboard(dashboard: AddDashboard): Observable<HttpResponse> {
    return this.http.post<HttpResponse>(
      `${environment.base_url}/dashboard`,
      dashboard
    );
  }

  public deleteDashboard(id: string): Observable<HttpResponse> {
    return this.http.delete<HttpResponse>(
      `${environment.base_url}/dashboard/${id}`
    );
  }

  public updateDashboard(dashboard: Dashboard): Observable<HttpResponse> {
    return this.http.patch<HttpResponse>(
      `${environment.base_url}/dashboard`,
      dashboard
    );
  }

  public getDashboard(board_id: string): Observable<HttpResponse> {
    return this.http.get<HttpResponse>(
      `${environment.base_url}/dashboard?board_id=${board_id}`
    );
  }

  public getDashboardsFromMember(user_id: string): Observable<HttpResponse> {
    return this.http.get<HttpResponse>(
      `${environment.base_url}/dashboard?member=${user_id}`
    );
  }

  public getAggregatedDashboard(board_id: string): Observable<HttpResponse> {
    return this.http.get<HttpResponse>(
      `${environment.base_url}/dashboard?board_id=${board_id}`
    );
  }

  public checkIfMember(payload: IfMemberDashboard): Observable<HttpResponse> {
    return this.http.post<HttpResponse>(
      `${environment.base_url}/dashboard/is_member`,
      payload
    );
  }
}
