import { Component } from '@angular/core';

@Component({
  selector: 'app-coffee',
  templateUrl: './coffee.component.html',
  styleUrls: ['./coffee.component.scss'],
})
export class CoffeeComponent {
  constructor() {}

  public onGoToCoffee(): void {
    window.open('https://www.buymeacoffee.com/jeremymees', '_blank');
  }
}
