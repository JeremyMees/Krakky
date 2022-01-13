import { Component } from '@angular/core';
import { NAV_ITEMS } from '../../data/nav-items.data';

@Component({
  selector: 'app-parent',
  templateUrl: './parent.component.html',
  styleUrls: ['./parent.component.scss'],
})
export class ParentComponent {
  nav_items: Array<string> = NAV_ITEMS;
  over_view: boolean = true;
  cards: boolean = false;
  lists: boolean = false;
  dashboards: boolean = false;
  users: boolean = false;

  constructor() {}

  public onChangeView(view: string): void {
    switch (view) {
      case 'Over view':
        this._onResetView();
        this.over_view = true;
        break;
      case 'Cards':
        this._onResetView();
        this.cards = true;
        break;
      case 'Lists':
        this._onResetView();
        this.lists = true;
        break;
      case 'Dashboards':
        this._onResetView();
        this.dashboards = true;
        break;
      case 'Users':
        this._onResetView();
        this.users = true;
        break;
    }
  }

  private _onResetView(): void {
    this.over_view = false;
    this.cards = false;
    this.lists = false;
    this.dashboards = false;
    this.users = false;
  }
}
