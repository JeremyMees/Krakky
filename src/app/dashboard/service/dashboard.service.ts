import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpResponse } from 'src/app/shared/models/http-response.model';
import { AddDashboard } from '../models/add-dashboard.model';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  constructor(private http: HttpClient) {}

  public addDashboard(dashboard: AddDashboard): Observable<HttpResponse> {
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
}
