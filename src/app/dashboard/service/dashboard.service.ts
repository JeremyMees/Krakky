import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpResponse } from 'src/app/shared/models/http-response.model';
import { User } from 'src/app/user/models/user.model';
import { UserService } from 'src/app/user/services/user.service';
import { AddDashboard } from '../models/add-dashboard.model';
import { Dashboard } from '../models/dashboard.model';
import { IfMemberDashboard } from '../models/if-member-dashboard.model';
@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  constructor(private http: HttpClient, private userService: UserService) {}

  public addDashboard(dashboard: AddDashboard): Observable<HttpResponse> {
    const user = this.userService.getCurrentUser().value as User;
    dashboard.team = [{ _id: user._id as string, role: 'Member' }];
    dashboard.private = true;
    return this.http.post<HttpResponse>(
      `http://localhost:3000/dashboard`,
      dashboard
    );
  }

  public deleteDashboard(id: string): Observable<HttpResponse> {
    return this.http.delete<HttpResponse>(
      `http://localhost:3000/dashboard/${id}`
    );
  }

  public updateDashboard(dashboard: Dashboard): Observable<HttpResponse> {
    return this.http.patch<HttpResponse>(
      `http://localhost:3000/dashboard`,
      dashboard
    );
  }

  public getDashboard(board_id: string): Observable<HttpResponse> {
    return this.http.get<HttpResponse>(
      `http://localhost:3000/dashboard?board_id=${board_id}`
    );
  }

  public checkIfMember(payload: IfMemberDashboard): Observable<HttpResponse> {
    return this.http.post<HttpResponse>(
      `http://localhost:3000/dashboard/is_member`,
      payload
    );
  }
}
