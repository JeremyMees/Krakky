import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpResponse } from 'src/app/shared/models/http-response.model';
import { Score } from 'src/app/tetris/models/score.model';

@Injectable({
  providedIn: 'root',
})
export class PageNotFoundService {
  constructor(private http: HttpClient) {}

  public onAddHighscore(score: Score): Observable<HttpResponse> {
    return this.http.post<HttpResponse>('http://localhost:3000/tetris', score);
  }

  public onGetHighscores(): Observable<HttpResponse> {
    return this.http.get<HttpResponse>('http://localhost:3000/tetris');
  }

  public onGetPersonalHighscore(id: string): Observable<HttpResponse> {
    return this.http.get<HttpResponse>(`http://localhost:3000/tetris/${id}`);
  }
}
