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
import { DashboardModule } from './dashboard/dashboard.module';
import { NotMemberModule } from './not-member/not-member.module';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { environment } from 'src/environments/environment';
import { CardModule } from './card/card.module';
import { ContactModule } from './contact/contact.module';
import { FooterModule } from './footer/footer.module';
import { PageNotFoundModule } from './page-not-found/page-not-found.module';

const config: SocketIoConfig = {
  url: environment.SOCKET_ENDPOINT,
  options: {
    reconnection: true,
    reconnectionDelay: 500,
    reconnectionAttempts: 10,
    autoConnect: false,
  },
};
@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    SocketIoModule.forRoot(config),
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
    DashboardModule,
    NotMemberModule,
    CardModule,
    ContactModule,
    FooterModule,
    PageNotFoundModule,
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
