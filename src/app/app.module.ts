import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AccountModule } from './account/account.module';
import { LandingModule } from './landing/landing.module';
import { LoginModule } from './login/login.module';
import { NavbarModule } from './navbar/navbar.module';
import { RegisterModule } from './register/register.module';
import { StylingModule } from './styling/styling.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    StylingModule,
    AppRoutingModule,
    NavbarModule,
    LandingModule,
    AccountModule,
    LoginModule,
    RegisterModule,
    BrowserAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
