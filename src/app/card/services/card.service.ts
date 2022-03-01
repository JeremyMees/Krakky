import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpResponse } from 'src/app/shared/models/http-response.model';
import { Member } from 'src/app/workspace/models/member.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CardService {
  constructor(private http: HttpClient) {}

  public getMemberInfo(members: Array<Member>): Observable<HttpResponse> {
    return this.http.post<HttpResponse>(
      `${environment.base_url}/dashboard/members`,
      members
    );
  }

  public getCardsCreated(user_id: string): Observable<HttpResponse> {
    return this.http.get<HttpResponse>(
      `${environment.base_url}/card/created_by/${user_id}`
    );
  }

  public getCardsAssigned(user_id: string): Observable<HttpResponse> {
    return this.http.get<HttpResponse>(
      `${environment.base_url}/card/assigned/${user_id}`
    );
  }
}
