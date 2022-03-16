import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountComponent } from './account/components/account/account.component';
import { ContactComponent } from './contact/components/contact/contact.component';
import { DashboardComponent } from './dashboard/components/dashboard/dashboard.component';
import { StatisticsComponent } from './dashboard/components/statistics/statistics.component';
import { ParentComponent } from './docs/components/parent/parent.component';
import { LoginGuard } from './guards/login/login.guard';
import { MemberDashboardGuard } from './guards/member-dashboard/member-dashboard.guard';
import { MemberWorkspaceGuard } from './guards/member-workspace/member-workspace.guard';
import { VerifiedGuard } from './guards/verified/verified.guard';
import { LandingComponent } from './landing/components/landing/landing.component';
import { NotMemberComponent } from './not-member/component/not-member.component';
import { NotVerifiedComponent } from './verify/components/not-verified/not-verified.component';
import { PageNotFoundComponent } from './page-not-found/components/page-not-found/page-not-found.component';
import { TeamComponent } from './team/components/team/team.component';
import { WorkspaceComponent } from './workspace/components/workspace-parent/workspace.component';
import { NotVerifiedGuard } from './guards/not-verified/not-verified.guard';
import { VerifyUserComponent } from './verify/components/verify-user/verify-user.component';
import { DeleteUserComponent } from './user/components/delete-user/delete-user.component';
import { WorkspaceJoinMemberComponent } from './workspace/components/workspace-join-member/workspace-join-member.component';
import { ResetPasswordComponent } from './user/components/reset-password/reset-password.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: LandingComponent },
  { path: 'contact', component: ContactComponent },
  {
    path: 'docs',
    component: ParentComponent,
  },
  {
    path: 'notverified',
    component: NotVerifiedComponent,
    canActivate: [LoginGuard],
  },
  {
    path: 'users/verify/:id',
    component: VerifyUserComponent,
    canActivate: [NotVerifiedGuard],
  },
  {
    path: 'users/delete/:id',
    component: DeleteUserComponent,
  },
  {
    path: 'users/reset-password/:token',
    component: ResetPasswordComponent,
  },
  { path: 'account', component: AccountComponent, canActivate: [LoginGuard] },
  {
    path: 'workspace',
    component: WorkspaceComponent,
    canActivate: [LoginGuard, VerifiedGuard],
  },
  {
    path: 'workspace/join/:workspace_id/:token',
    component: WorkspaceJoinMemberComponent,
    canActivate: [LoginGuard, VerifiedGuard],
  },
  {
    path: 'workspace/:id',
    component: WorkspaceComponent,
    canActivate: [LoginGuard, VerifiedGuard, MemberWorkspaceGuard],
  },
  {
    path: 'dashboard/statistics/:id',
    component: StatisticsComponent,
    canActivate: [LoginGuard, VerifiedGuard, MemberDashboardGuard],
  },
  {
    path: 'dashboard/:id',
    component: DashboardComponent,
    canActivate: [LoginGuard, VerifiedGuard, MemberDashboardGuard],
  },
  {
    path: 'team/:id',
    component: TeamComponent,
    canActivate: [LoginGuard, VerifiedGuard, MemberWorkspaceGuard],
  },
  {
    path: 'notmember',
    component: NotMemberComponent,
    canActivate: [LoginGuard, VerifiedGuard],
  },
  { path: '**', pathMatch: 'full', component: PageNotFoundComponent },
  {
    path: 'docs',
    loadChildren: () =>
      import('./docs/documentation.module').then((m) => m.DocumentationModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
