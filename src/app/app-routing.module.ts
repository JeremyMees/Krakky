import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountComponent } from './account/components/account/account.component';
import { DashboardComponent } from './dashboard/components/dashboard/dashboard.component';
import { StatisticsComponent } from './dashboard/components/statistics/statistics.component';
import { LoginGuard } from './guards/login/login.guard';
import { MemberDashboardGuard } from './guards/member-dashboard/member-dashboard.guard';
import { MemberWorkspaceGuard } from './guards/member-workspace/member-workspace.guard';
import { LandingComponent } from './landing/components/landing/landing.component';
import { NotMemberComponent } from './not-member/component/not-member.component';
import { TeamComponent } from './team/components/team/team.component';
import { WorkspaceComponent } from './workspace/components/workspace-parent/workspace.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: LandingComponent },
  { path: 'account', component: AccountComponent, canActivate: [LoginGuard] },
  {
    path: 'workspace',
    component: WorkspaceComponent,
    canActivate: [LoginGuard],
  },
  {
    path: 'workspace/:id',
    component: WorkspaceComponent,
    canActivate: [LoginGuard, MemberWorkspaceGuard],
  },
  {
    path: 'dashboard/statistics/:id',
    component: StatisticsComponent,
    canActivate: [LoginGuard, MemberDashboardGuard],
  },
  {
    path: 'dashboard/:id',
    component: DashboardComponent,
    canActivate: [LoginGuard, MemberDashboardGuard],
  },
  {
    path: 'team/:id',
    component: TeamComponent,
    canActivate: [LoginGuard, MemberWorkspaceGuard],
  },
  {
    path: 'notmember',
    component: NotMemberComponent,
    canActivate: [LoginGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
