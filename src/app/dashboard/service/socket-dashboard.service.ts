import { Injectable } from '@angular/core';
import { Observable, Subscriber } from 'rxjs';
import { HttpResponse } from 'src/app/shared/models/http-response.model';
import { Card } from 'src/app/card/models/card.model';
import { List } from 'src/app/list/models/list.model';
import { AddList } from '../models/add-list.model';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root',
})
export class SocketDashboardService {
  observer!: Subscriber<HttpResponse>;

  constructor(private socket: Socket) {}

  public onSubscribeDashboard(id: string): Observable<HttpResponse> {
    this.socket.connect();

    this.socket.on(id, (res: HttpResponse) => {
      this.observer.next(res);
    });

    this.socket.on('connect', () => {
      this.socket.emit('get-dashboard', { board_id: id });
    });

    return this._getSocketDataObservable();
  }

  private _getSocketDataObservable(): Observable<HttpResponse> {
    return new Observable((observer) => {
      this.observer = observer;
    });
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.disconnect(true);
    }
  }

  public addCard(list: AddList): void {
    this.socket.emit('add-card', list);
  }

  public updateCard(card: Card): void {
    const { created_at, created_by, __v, ...payload } = card;
    this.socket.emit('update-card', payload);
  }

  public deleteCard(card: Card): void {
    this.socket.emit('delete-card', { board_id: card.board_id, _id: card._id });
  }

  public addList(list: AddList): void {
    this.socket.emit('add-list', list);
  }

  public updateList(list: List): void {
    const { __v, ...payload } = list;
    this.socket.emit('update-list', payload);
  }

  public deleteList(list: List): void {
    const { __v, title, index, ...payload } = list;
    this.socket.emit('delete-list', payload);
  }
}
