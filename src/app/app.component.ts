import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { AuthService } from './auth/services/auth.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    private primengConfig: PrimeNGConfig,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.primengConfig.ripple = true;
    this.authService.autoLogin();
  }
}
