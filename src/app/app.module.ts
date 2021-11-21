import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AccountModule } from './account/account.module';
import { LandingModule } from './landing/landing.module';
import { LoginModule } from './login/login.module';
import { NavbarModule } from './navbar/navbar.module';
import { RegisterModule } from './register/register.module';
import { StylingModule } from './styling/styling.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { WorkspaceModule } from './workspace/workspace.module';
import { AuthorizationInterceptor } from './interceptors/authorization/authorization.interceptor';
import { SharedModule } from './shared/shared.module';
import { TeamModule } from './team/team.module';
@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    StylingModule,
    SharedModule,
    AppRoutingModule,
    NavbarModule,
    LandingModule,
    AccountModule,
    LoginModule,
    RegisterModule,
    WorkspaceModule,
    TeamModule,
  ],
  bootstrap: [AppComponent],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthorizationInterceptor,
      multi: true,
    },
  ],
})
export class AppModule {}
