import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpResponse } from 'src/app/shared/models/http-response.model';
import { Member } from 'src/app/workspace/models/member.model';

@Injectable({
  providedIn: 'root',
})
export class CardService {
  constructor(private http: HttpClient) {}

  public getMemberInfo(members: Array<Member>): Observable<HttpResponse> {
    return this.http.post<HttpResponse>(
      `http://localhost:3000/dashboard/members`,
      members
    );
  }

  public getCardsCreated(user_id: string): Observable<HttpResponse> {
    return this.http.get<HttpResponse>(
      `http://localhost:3000/card/created_by/${user_id}`
    );
  }

  public getCardsAssigned(user_id: string): Observable<HttpResponse> {
    return this.http.get<HttpResponse>(
      `http://localhost:3000/card/assigned/${user_id}`
    );
  }
}
