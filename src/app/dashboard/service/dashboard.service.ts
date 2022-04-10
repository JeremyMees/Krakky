import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpResponse } from 'src/app/shared/models/http-response.model';
import { environment } from 'src/environments/environment';
import { AddDashboard } from '../models/add-dashboard.model';
import { AddList } from '../models/add-list.model';
import { Dashboard } from '../models/dashboard.model';
import { IfMemberDashboard } from '../models/if-member-dashboard.model';
@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  constructor(private http: HttpClient) {}

  public onAddDashboard(dashboard: AddDashboard): Observable<HttpResponse> {
    return this.http.post<HttpResponse>(
      `${environment.base_url}/dashboard`,
      dashboard
    );
  }

  public onAddList(list: AddList): Observable<HttpResponse> {
    return this.http.post<HttpResponse>(`${environment.base_url}/list`, list);
  }

  public onDeleteDashboard(id: string): Observable<HttpResponse> {
    return this.http.delete<HttpResponse>(
      `${environment.base_url}/dashboard/${id}`
    );
  }

  public onUpdateDashboard(dashboard: Dashboard): Observable<HttpResponse> {
    return this.http.patch<HttpResponse>(
      `${environment.base_url}/dashboard`,
      dashboard
    );
  }

  public onGetDashboard(board_id: string): Observable<HttpResponse> {
    return this.http.get<HttpResponse>(
      `${environment.base_url}/dashboard?board_id=${board_id}`
    );
  }

  public onGetDashboardsFromMember(user_id: string): Observable<HttpResponse> {
    return this.http.get<HttpResponse>(
      `${environment.base_url}/dashboard?member=${user_id}`
    );
  }

  public onGetAggregatedDashboard(board_id: string): Observable<HttpResponse> {
    return this.http.get<HttpResponse>(
      `${environment.base_url}/dashboard?board_id=${board_id}`
    );
  }

  public onCheckIfMember(payload: IfMemberDashboard): Observable<HttpResponse> {
    return this.http.post<HttpResponse>(
      `${environment.base_url}/dashboard/is_member`,
      payload
    );
  }

  public onLeaveDashboard(
    dashboard_id: string,
    user_id: string
  ): Observable<HttpResponse> {
    return this.http.delete<HttpResponse>(
      `${environment.base_url}/dashboard/member/${dashboard_id}/${user_id}`
    );
  }
}
