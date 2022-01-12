import { Component } from '@angular/core';
import { NAV_ITEMS } from '../../data/nav-items.data';

@Component({
  selector: 'app-parent',
  templateUrl: './parent.component.html',
  styleUrls: ['./parent.component.scss'],
})
export class ParentComponent {
  nav_items: Array<string> = NAV_ITEMS;

  constructor() {}

  public onChangeView(view: string): void {}
}
