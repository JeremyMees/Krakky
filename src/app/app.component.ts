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
    const expiration_date_token: number = Number(
      localStorage.getItem('token_expiration')
    );
    if (expiration_date_token > Date.now() && localStorage.getItem('user')) {
      this.authService.autoLogin();
    }
  }
}
