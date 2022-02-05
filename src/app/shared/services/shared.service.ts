import { Injectable } from '@angular/core';
import { RandomColors } from '../models/random-colors.model';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  constructor() {}

  public onGenerateRandomColors(): RandomColors {
    const random: string = '#' + ((Math.random() * 0xffffff) << 0).toString(16);
    if (random.length < 7) random + 0;
    return {
      color: this.onGenerateOppositeColor(random),
      bg_color: random,
    };
  }

  public onGenerateOppositeColor(hex: string): string {
    if (hex.indexOf('#') === 0) {
      hex = hex.slice(1);
    }
    if (hex.length === 3) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    if (hex.length < 6) {
      hex = hex + '0';
    }
    const r: number = parseInt(hex.slice(0, 2), 16);
    const g: number = parseInt(hex.slice(2, 4), 16);
    const b: number = parseInt(hex.slice(4, 6), 16);
    return r * 0.299 + g * 0.587 + b * 0.114 > 186 ? '#000000' : '#FFFFFF';
  }
}
