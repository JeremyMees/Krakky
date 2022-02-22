import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpResponse } from 'src/app/shared/models/http-response.model';
import { Score } from 'src/app/tetris/models/score.model';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class PageNotFoundService {
  constructor(private http: HttpClient) {}

  public onAddHighscore(score: Score): Observable<HttpResponse> {
    return this.http.post<HttpResponse>(
      `${environment.base_url}/tetris`,
      score
    );
  }

  public onGetHighscores(): Observable<HttpResponse> {
    return this.http.get<HttpResponse>(`${environment.base_url}/tetris`);
  }

  public onGetPersonalHighscore(id: string): Observable<HttpResponse> {
    return this.http.get<HttpResponse>(`${environment.base_url}/tetris/${id}`);
  }
}
